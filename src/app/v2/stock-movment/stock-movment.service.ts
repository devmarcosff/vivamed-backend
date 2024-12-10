import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, ILike, Repository } from 'typeorm';
import { StockProductV2 } from '../stock-product/entities/stock-product.entity';
import { CreateStockMovementDto } from './dto/create-stock-movment.dto';
import { StockMovementFilterDto } from './dto/filter-stock-movment.dto';
import { StockMovementDto } from './dto/stock-movment.dto';
import { StockMovement } from './entities/stock-movment.entity';

@Injectable()
export class StockMovementService {
    constructor(
        @InjectRepository(StockMovement)
        private readonly movementRepository: Repository<StockMovement>,
        private dataSource: DataSource,
    ) { }

    async create(dto: CreateStockMovementDto): Promise<StockMovement> {
        return this.dataSource.transaction(async (manager) => {
            const stockRepository = manager.getRepository(StockProductV2);
            const movementRepository = manager.getRepository(StockMovement);

            const stock = await stockRepository.findOne({
                where: { id: dto.stockProductId },
            });

            if (!stock) {
                throw new NotFoundException('Product not found.');
            }

            if (dto.type === 'IN') {
                stock.quantity += dto.quantity;
            } else if (dto.type === 'OUT') {
                if (stock.quantity < dto.quantity) {
                    throw new BadRequestException('Insufficient stock.');
                }
                stock.quantity -= dto.quantity;
            } else {
                throw new BadRequestException('Invalid movement type.');
            }

            await stockRepository.update(stock.id, { quantity: stock.quantity });

            const movement = movementRepository.create({
                stockProduct: stock,
                type: dto.type,
                quantity: dto.quantity,
                description: dto.description,
            });

            const savedMovement = await movementRepository.save(movement);

            return savedMovement;
        });
    }

    async findAll(filter: StockMovementFilterDto): Promise<IPagination<StockMovementDto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        if (filter.productName) {
            where.stockProduct = {
                product: {
                    name: ILike(`%${filter.productName}%`)
                }
            }
        }

        if (filter.type) {
            where.type = filter.type;
        }

        where.enabled = true;

        const [items, total] = await this.movementRepository.findAndCount({
            where,
            relations: {
                stockProduct: {
                    product: true
                }
            },
            take: limit,
            skip: skip,
            order: { createdAt: 'DESC' },
        });

        const movementDtos = items.map((movement) => movement.toDto());

        return {
            items: movementDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
