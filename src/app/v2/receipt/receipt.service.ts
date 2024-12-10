import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, ILike, Repository } from 'typeorm';
import { Firm } from '../firm/entities/firm.entity';
import { ProductV2 } from '../product/entities/product.entity';
import { CreateStockMovementDto } from '../stock-movment/dto/create-stock-movment.dto';
import { StockMovement } from '../stock-movment/entities/stock-movment.entity';
import { StockMovementService } from '../stock-movment/stock-movment.service';
import { StockProductV2 } from '../stock-product/entities/stock-product.entity';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { ReceiptFilterDto } from './dto/filter-receipt.dto';
import { ReceiptDto } from './dto/receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { ReceiptProduct } from './entities/receipt-product.entity';
import { Receipt } from './entities/receipt.entity';

@Injectable()
export class ReceiptService {
    constructor(
        @InjectRepository(Receipt)
        private readonly receiptRepository: Repository<Receipt>,
        private readonly dataSource: DataSource,
        private readonly stockMovementService: StockMovementService
    ) { }

    async create(dto: CreateReceiptDto): Promise<ReceiptDto> {
        try {
            return this.dataSource.transaction(async (manager) => {
                const receiptRepository = manager.getRepository(Receipt);
                const firmRepository = manager.getRepository(Firm);
                const productV2Repository = manager.getRepository(ProductV2);
                const stockProductV2Repository = manager.getRepository(StockProductV2);
                const receiptProductRepository = manager.getRepository(ReceiptProduct);

                const receiptDB = await receiptRepository.findOneBy({ invoiceNumber: dto.invoiceNumber });

                if (receiptDB) {
                    receiptDB.enabled = true;
                    await this.receiptRepository.update(receiptDB.id, receiptDB);
                    throw new BadRequestException('Receipt with this number already exists.');
                }

                if (dto.issuerCnpj == dto.recipientCnpj) {
                    throw new BadRequestException('Issuer or recipient firm not found.');
                }

                const firmIssuerCnpj = await firmRepository.findOneBy({ cnpj: dto.issuerCnpj });
                const firmRecipientCnpj = await firmRepository.findOneBy({ cnpj: dto.recipientCnpj });

                if (!firmIssuerCnpj || !firmRecipientCnpj) {
                    throw new BadRequestException('Issuer or recipient firm not found.');
                }

                const newReceipt = {
                    invoiceNumber: dto.invoiceNumber,
                    invoiceSeries: dto.invoiceSeries,
                    issueDateTime: new Date(dto.issueDateTime),
                    issuerCnpj: firmIssuerCnpj,
                    recipientCnpj: firmRecipientCnpj,
                    barcodeOrAuthCode: dto.barcodeOrAuthCode || '',
                    icmsBase: dto.icmsBase || 0,
                    icmsRate: dto.icmsRate || 0,
                    icmsValue: dto.icmsValue || 0,
                    ipiRate: dto.ipiRate || 0,
                    ipiValue: dto.ipiValue || 0,
                    issRate: dto.issRate || 0,
                    issValue: dto.issValue || 0,
                    nfeAccessKey: dto.nfeAccessKey || '',
                    totalValue: dto.totalValue || 0,
                } as Receipt;
                const newReceiptCreate = receiptRepository.create(newReceipt);
                const receipt = await receiptRepository.save(newReceiptCreate);

                if (dto.receiptProducts.length == 0) {
                    throw new BadRequestException(`Product not found.`);
                }

                const receiptProducts: ReceiptProduct[] = [];
                for (const rp of dto.receiptProducts) {
                    const productDb = await productV2Repository.findOneBy({ code: rp.productCode });
                    if (!productDb) {
                        throw new BadRequestException(`Product with code ${rp.productCode} not found.`);
                    }

                    let productStockDB = await stockProductV2Repository.findOneBy({
                        product: { id: productDb.id },
                        batch: rp.productBatch
                    });

                    if (productStockDB) {
                        productStockDB.quantity += (rp.quantity ?? 0);
                        if (rp.productExpirationDate) {
                            const newExpirationDate = new Date(rp.productExpirationDate);
                            const currentExpirationDate = productStockDB.expirationDate
                                ? new Date(productStockDB.expirationDate)
                                : null;

                            productStockDB.expirationDate = currentExpirationDate
                                ? new Date(Math.min(newExpirationDate.getTime(), currentExpirationDate.getTime()))
                                : newExpirationDate;
                        }

                        if (rp.productManufacturingDate) {
                            const newManufactureDate = new Date(rp.productManufacturingDate);
                            const currentManufactureDate = productStockDB.manufactureDate
                                ? new Date(productStockDB.manufactureDate)
                                : null;

                            productStockDB.manufactureDate = currentManufactureDate
                                ? new Date(Math.min(newManufactureDate.getTime(), currentManufactureDate.getTime()))
                                : newManufactureDate;
                        }
                        productStockDB.updatedAt = new Date();
                        await stockProductV2Repository.save(productStockDB);
                    } else {
                        const newProductStock = {
                            product: productDb,
                            batch: rp.productBatch,
                            quantity: rp.quantity ?? 0,
                            unitPrice: rp.unitPrice ?? 0,
                            expirationDate: rp.productExpirationDate,
                            manufactureDate: rp.productManufacturingDate,
                        } as StockProductV2
                        const newProductStockCreate = stockProductV2Repository.create(newProductStock);
                        productStockDB = await stockProductV2Repository.save(newProductStockCreate);
                    }

                    const newReceiptProduct = {
                        stockProduct: productStockDB,
                        bcIcms: rp.bcIcms || 0,
                        vIcms: rp.vIcms || 0,
                        vIpi: rp.vIpi || 0,
                        aIcms: rp.aIcms || 0,
                        aIpi: rp.aIpi || 0,
                        cfopCode: rp.cfopCode || '',
                        cst: rp.cst || '',
                        ncmCode: rp.ncmCode || '',
                        quantity: rp.quantity ?? 0,
                        unitPrice: rp.unitPrice ?? 0,
                        totalValue: (rp.quantity ?? 0) * rp.unitPrice,
                        unitOfMeasure: rp.unitOfMeasure || '',
                        receipt: receipt,
                    } as ReceiptProduct;
                    const newReceiptProductCreate = receiptProductRepository.create(newReceiptProduct);
                    receiptProducts.push(newReceiptProductCreate);

                    //#region Movement
                    var movementDto = {
                        stockProductId: productStockDB.id,
                        type: "IN",
                        quantity: productStockDB.quantity,
                        description: "Receipt entry"
                    } as CreateStockMovementDto;

                    const stockRepository = manager.getRepository(StockProductV2);
                    const movementRepository = manager.getRepository(StockMovement);

                    const stock = await stockRepository.findOne({
                        where: { id: movementDto.stockProductId },
                    });

                    if (!stock) {
                        throw new NotFoundException('Product not found.');
                    }

                    if (movementDto.type === 'IN') {
                        stock.quantity += movementDto.quantity;
                    } else if (movementDto.type === 'OUT') {
                        if (stock.quantity < movementDto.quantity) {
                            throw new BadRequestException('Insufficient stock.');
                        }
                        stock.quantity -= movementDto.quantity;
                    } else {
                        throw new BadRequestException('Invalid movement type.');
                    }

                    await stockRepository.update(stock.id, { quantity: stock.quantity });

                    const movement = movementRepository.create({
                        stockProduct: stock,
                        type: movementDto.type,
                        quantity: movementDto.quantity,
                        description: movementDto.description,
                    });

                    await movementRepository.save(movement);
                    //#endregion
                }

                await receiptProductRepository.save(receiptProducts);

                return receipt.toDto();
            });
        }
        catch (error) {
            throw new BadRequestException(error);
        }
    }

    async findOne(id: string): Promise<ReceiptDto> {
        const receipt = await this.receiptRepository.findOne({
            where: { id, enabled: true },
            relations: {
                issuerCnpj: true,
                recipientCnpj: true,
                receiptProducts: {
                    stockProduct: {
                        product: true,
                    },
                }
            }
        });
        if (!receipt) {
            throw new NotFoundException('Receipt not found.');
        }

        return receipt.toDto();
    }

    async findAll(filter: ReceiptFilterDto): Promise<IPagination<ReceiptDto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        if (filter.invoiceNumber) {
            where.invoiceNumber = ILike(`%${filter.invoiceNumber}%`);
        }

        if (filter.invoiceSeries) {
            where.invoiceSeries = ILike(`%${filter.invoiceSeries}%`);
        }

        if (filter.issueDateTime) {
            where.issueDateTime = filter.issueDateTime;
        }

        if (filter.issuerCnpj) {
            where.issuerCnpj = { cnpj: ILike(`%${filter.issuerCnpj}%`) };
        }

        where.enabled = true;

        const [items, total] = await this.receiptRepository.findAndCount({
            where,
            relations: {
                issuerCnpj: true,
                recipientCnpj: true,
                receiptProducts: {
                    stockProduct: {
                        product: true,
                    },
                }
            },
            take: limit,
            skip: skip,
            order: {
                createdAt: 'DESC',
            },
        });

        const receiptDtos = items.map((receipt) => receipt.toDto());

        return {
            items: receiptDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async update(id: string, dto: UpdateReceiptDto): Promise<ReceiptDto> {
        try {
            return this.dataSource.transaction(async (manager) => {
                const receiptRepository = manager.getRepository(Receipt);
                const firmRepository = manager.getRepository(Firm);

                const receiptDb = await receiptRepository.findOneBy({ id, enabled: true });
                if (!receiptDb) {
                    throw new BadRequestException('Receipt not found.');
                }

                if (dto.issuerCnpj == dto.recipientCnpj) {
                    throw new BadRequestException('Issuer or recipient firm not found.');
                }

                const firmIssuerCnpj = await firmRepository.findOneBy({ cnpj: dto.issuerCnpj });
                const firmRecipientCnpj = await firmRepository.findOneBy({ cnpj: dto.recipientCnpj });

                if (!firmIssuerCnpj || !firmRecipientCnpj) {
                    throw new BadRequestException('Issuer or recipient firm not found.');
                }

                const newReceipt = {
                    invoiceNumber: dto.invoiceNumber,
                    invoiceSeries: dto.invoiceSeries,
                    issueDateTime: new Date(dto.issueDateTime),
                    issuerCnpj: firmIssuerCnpj,
                    recipientCnpj: firmRecipientCnpj,
                    barcodeOrAuthCode: dto.barcodeOrAuthCode || '',
                    icmsBase: dto.icmsBase || 0,
                    icmsRate: dto.icmsRate || 0,
                    icmsValue: dto.icmsValue || 0,
                    ipiRate: dto.ipiRate || 0,
                    ipiValue: dto.ipiValue || 0,
                    issRate: dto.issRate || 0,
                    issValue: dto.issValue || 0,
                    nfeAccessKey: dto.nfeAccessKey || '',
                    totalValue: dto.totalValue || 0,
                } as Receipt;

                await receiptRepository.update(receiptDb.id, newReceipt);

                const receiptUpdateDb = await receiptRepository.findOneBy({ id });
                return receiptUpdateDb.toDto();
            });
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async remove(id: string): Promise<void> {
        const receiptDb = await this.receiptRepository.findOneBy({ id, enabled: true });

        if (!receiptDb) {
            throw new NotFoundException('Receipt not found.');
        }
        receiptDb.enabled = false;
        await this.receiptRepository.update(id, { enabled: false });
    }

}
