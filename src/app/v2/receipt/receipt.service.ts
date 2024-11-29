import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';
import { Firm } from '../firm/entities/firm.entity';
import { ProductV2 } from '../product/entities/product.entity';
import { StockProductV2 } from '../product/entities/stock-product.entity';
import { ReceiptProduct } from '../receipt-product/entities/receipt-product.entity';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { ReceiptDto } from './dto/receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { Receipt } from './entities/receipt.entity';

@Injectable()
export class ReceiptService {
    constructor(
        @InjectRepository(Receipt)
        private readonly receiptRepository: Repository<Receipt>,
        private readonly dataSource: DataSource,
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
                        productStockDB.expirationDate = new Date(
                            Math.min(new Date(rp.productExpirationDate).getTime(), productStockDB.expirationDate.getTime())
                        );
                        productStockDB.manufactureDate = new Date(
                            Math.min(new Date(rp.productManufacturingDate).getTime(), productStockDB.manufactureDate.getTime())
                        );
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
                        product: productDb,
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
        const receipt = await this.receiptRepository.findOne({ where: { id } });

        if (!receipt) {
            throw new NotFoundException('Receipt not found');
        }

        return plainToClass(ReceiptDto, receipt);
    }

    async update(id: string, dto: UpdateReceiptDto): Promise<ReceiptDto> {
        // return this.dataSource.transaction(async (manager) => {
        //     const receiptRepository = manager.getRepository(Receipt);

        //     const receipt = await receiptRepository.findOne({ where: { id }, lock: { mode: 'pessimistic_write' } });

        //     if (!receipt) {
        //         throw new NotFoundException('Receipt not found');
        //     }

        //     Object.assign(receipt, {
        //         ...dto,
        //         issueDateTime: dto.issueDateTime ? new Date(dto.issueDateTime) : receipt.issueDateTime,
        //         nfeAuthDateTime: dto.nfeAuthDateTime ? new Date(dto.nfeAuthDateTime) : receipt.nfeAuthDateTime,
        //     });

        //     await receiptRepository.save(receipt);
        //     return plainToClass(ReceiptDto, receipt);
        // });
        return null;
    }

    async remove(id: string): Promise<void> {
        // const receipt = await this.receiptRepository.findOne({ where: { id } });

        // if (!receipt) {
        //     throw new NotFoundException('Receipt not found');
        // }

        // await this.receiptRepository.remove(receipt);
    }
}
