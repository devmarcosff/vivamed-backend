import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, ILike, Repository } from 'typeorm';
import { CreateProductV2Dto } from './dto/create-product.dto';
import { ProductV2FilterDto } from './dto/filter-product.dto';
import { ProductV2Dto } from './dto/product.dto';
import { UpdateProductV2Dto } from './dto/update-product.dto';
import { ProductV2 } from './entities/product.entity';

@Injectable()
export class ProductV2Service {
    constructor(
        @InjectRepository(ProductV2)
        private readonly productRepository: Repository<ProductV2>,
        private dataSource: DataSource,
    ) { }

    async create(dto: CreateProductV2Dto): Promise<ProductV2Dto> {
        return this.dataSource.transaction(async (manager) => {
            const pRepository = manager.getRepository(ProductV2);

            const existingProduct = await pRepository.findOne({
                where: { code: dto.code },
            });

            if (existingProduct) {
                existingProduct.enabled = true;
                await this.productRepository.update(existingProduct.id, existingProduct);
                throw new BadRequestException('A product with this code already exists.');
            }

            const newProduct = pRepository.create(dto);
            const savedProduct = await pRepository.save(newProduct);

            return savedProduct.toDto();
        });
    }

    async findAll(filter: ProductV2FilterDto): Promise<IPagination<ProductV2Dto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        if (filter.code) {
            where.code = ILike(`%${filter.code}%`);
        }

        if (filter.name) {
            where.name = ILike(`%${filter.name}%`);
        }

        if (filter.manufacturer) {
            where.manufacturer = ILike(`%${filter.manufacturer}%`);
        }

        if (filter.activeIngredient) {
            where.activeIngredient = ILike(`%${filter.activeIngredient}%`);
        }

        if (filter.concentration) {
            where.concentration = ILike(`%${filter.concentration}%`);
        }

        if (filter.healthRegistration) {
            where.healthRegistration = ILike(`%${filter.healthRegistration}%`);
        }

        where.enabled = true;

        const [items, total] = await this.productRepository.findAndCount({
            where,
            take: limit,
            skip: skip,
            order: { name: 'ASC' },
        });

        const productDtos = items.map((product) => product.toDto());

        return {
            items: productDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<ProductV2Dto> {
        const product = await this.productRepository.findOne({ where: { id, enabled: true } });
        if (!product) {
            throw new NotFoundException('ProductV2 not found');
        }
        return product as ProductV2Dto;
    }

    async update(id: string, dto: UpdateProductV2Dto): Promise<ProductV2Dto> {
        return this.dataSource.transaction(async (manager) => {
            const pRepository = manager.getRepository(ProductV2);

            const productDb = await pRepository.findOne({
                where: { id },
            });

            if (!productDb) {
                throw new NotFoundException('ProductV2 not found');
            }

            Object.assign(productDb, dto);

            await pRepository.save(productDb);

            return productDb as ProductV2Dto;
        });
    }


    async remove(id: string): Promise<void> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException('ProductV2 not found');
        }
        product.enabled = false;
        await this.productRepository.save(product);
    }
}
