import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, ILike, Repository } from 'typeorm';
import { CreateReceiptProductDto } from './dto/create-receipt-product.dto';
import { ReceiptProductFilterDto } from './dto/filter-receipt-product.dto';
import { ReceiptProductDto } from './dto/receipt-product.dto';
import { UpdateReceiptProductDto } from './dto/update-receipt-product.dto';
import { ReceiptProduct } from './entities/receipt-product.entity';

@Injectable()
export class ReceiptProductService {
    constructor(
        @InjectRepository(ReceiptProduct)
        private readonly receiptProductRepository: Repository<ReceiptProduct>,
        private readonly dataSource: DataSource,
    ) { }

    async create(dto: CreateReceiptProductDto): Promise<ReceiptProductDto> {
        return this.dataSource.transaction(async (manager) => {
            const productRepository = manager.getRepository(ReceiptProduct);

            const newProduct = productRepository.create({
                ...dto,
                totalValue: dto.quantity * dto.unitValue,
                receipt: { id: dto.receiptId },
            });

            return productRepository.save(newProduct) as unknown as ReceiptProductDto;
        });
    }

    async findAll(filter: ReceiptProductFilterDto): Promise<IPagination<ReceiptProductDto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        if (filter.productCode) {
            where.productCode = ILike(`%${filter.productCode}%`);
        }

        if (filter.description) {
            where.description = ILike(`%${filter.description}%`);
        }

        const [items, total] = await this.receiptProductRepository.findAndCount({
            where,
            take: limit,
            skip: skip,
            order: {
                product: {
                    name: 'ASC'
                },
            },
        });

        const receiptProductDtos = items.map((product) => product.toDto());

        return {
            items: receiptProductDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<ReceiptProductDto> {
        const receiptProduct = await this.receiptProductRepository.findOneBy({ id });

        if (!receiptProduct) {
            throw new NotFoundException('Receipt product not found');
        }

        return receiptProduct.toDto();
    }

    async update(id: string, dto: UpdateReceiptProductDto): Promise<ReceiptProduct> {
        const product = await this.receiptProductRepository.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        Object.assign(product, {
            ...dto,
            totalValue: dto.quantity ? dto.quantity * (dto.unitValue || product.unitValue) : product.totalValue,
        });

        return this.receiptProductRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        const product = await this.receiptProductRepository.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this.receiptProductRepository.remove(product);
    }
}
