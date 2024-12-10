import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { ILike, Repository } from 'typeorm';
import { StockProductFilterDto } from './dto/filter-stock-product.dto';
import { StockProductV2Dto } from './dto/stock-product.dto';
import { StockProductV2 } from './entities/stock-product.entity';

@Injectable()
export class StockProductService {
    constructor(
        @InjectRepository(StockProductV2)
        private readonly stockProductRepository: Repository<StockProductV2>,
    ) { }

    async findAll(filter: StockProductFilterDto): Promise<IPagination<StockProductV2Dto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        if (filter.batch) {
            where.batch = ILike(`%${filter.batch}%`);
        }

        if (filter.location) {
            where.location = ILike(`%${filter.location}%`);
        }

        if (filter.productId) {
            where.product = { id: filter.productId };
        }

        if (filter.productName) {
            where.product = { name: ILike(`%${filter.productName}%`) };
        }

        where.enabled = true;

        const [items, total] = await this.stockProductRepository.findAndCount({
            where,
            take: limit,
            skip,
            relations: ['product'],
            order: { batch: 'ASC' },
        });

        const stockProductDtos = items.map((stockProduct) => stockProduct.toDto());

        return {
            items: stockProductDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<StockProductV2Dto> {
        const stockProduct = await this.stockProductRepository.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!stockProduct) {
            throw new NotFoundException('Stock product not found');
        }

        return stockProduct.toDto();
    }
}
