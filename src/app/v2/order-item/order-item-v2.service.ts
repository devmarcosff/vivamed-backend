import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, Repository } from 'typeorm';
import { OrderV2 } from '../order/entities/order-v2.entity';
import { StockProductV2 } from '../stock-product/entities/stock-product.entity';
import { CreateOrderItemV2Dto } from './dto/create-order-item-v2.dto';
import { OrderItemV2FilterDto } from './dto/filter-order-item-v2.dto';
import { OrderItemV2Dto } from './dto/order-item-v2.dto';
import { UpdateOrderItemV2Dto } from './dto/update-order-item-v2.dto';
import { OrderItemV2 } from './entities/order-item-v2.entity';

@Injectable()
export class OrderItemV2Service {
    constructor(
        @InjectRepository(OrderItemV2)
        private readonly orderItemRepository: Repository<OrderItemV2>,
        private dataSource: DataSource,
    ) { }

    async create(dto: CreateOrderItemV2Dto): Promise<OrderItemV2Dto> {
        return this.dataSource.transaction(async (manager) => {
            const oRepository = manager.getRepository(OrderV2);
            const oiRepository = manager.getRepository(OrderItemV2);
            const spRepository = manager.getRepository(StockProductV2);

            const orderDb = await oRepository.findOneBy({ id: dto.orderId });

            if (!orderDb) {
                throw new NotFoundException(`Order not found`);
            }

            const stockDb = await spRepository.findOneBy({ id: dto.stockProductId });

            if (!stockDb) {
                throw new NotFoundException(`Stock product not found`);
            }

            const newOrderItem = {
                order: orderDb,
                price: dto.quantity * stockDb.unitPrice,
                quantity: dto.quantity,
                stockProduct: stockDb,
            } as OrderItemV2;
            const orderItemCreated = oiRepository.create(newOrderItem);
            const savedOrderItem = await oiRepository.save(orderItemCreated);

            return savedOrderItem.toDto();
        });
    }

    async findAll(filter: OrderItemV2FilterDto): Promise<IPagination<OrderItemV2Dto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        where.enabled = true;

        if (filter.orderId) {
            where.order = {
                id: filter.orderId
            }
        }

        if (filter.stockProductId) {
            where.stockProduct = {
                id: filter.stockProductId
            }
        }

        if (filter.productName) {
            where.stockProduct = {
                ...where.stockProduct,
                product: {
                    name: filter.productName
                }
            }
        }

        const [items, total] = await this.orderItemRepository.findAndCount({
            where,
            take: limit,
            skip: skip,
            relations: {
                stockProduct: { product: true },
                order: true,
            },
            order: { createdAt: 'ASC' },
        });

        const orderItemDtos = items.map((orderItem) => orderItem.toDto());

        return {
            items: orderItemDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<OrderItemV2Dto> {
        const orderItem = await this.orderItemRepository.findOne({
            where: { id, enabled: true },
            relations: ['stockProduct', 'order']
        });
        if (!orderItem) {
            throw new NotFoundException('Order item not found');
        }
        return orderItem.toDto();
    }

    async update(id: string, dto: UpdateOrderItemV2Dto): Promise<OrderItemV2Dto> {
        return this.dataSource.transaction(async (manager) => {
            const oiRepository = manager.getRepository(OrderItemV2);

            const orderItemDb = await oiRepository.findOne({
                where: { id, enabled: true },
                relations: {
                    stockProduct: true,
                }
            });

            if (!orderItemDb) {
                throw new NotFoundException('Order item not found');
            }

            orderItemDb.quantity = dto.quantity;
            orderItemDb.price = orderItemDb.stockProduct.unitPrice * dto.quantity;

            await oiRepository.update(id, orderItemDb);

            return orderItemDb.toDto();
        });
    }

    async remove(id: string): Promise<void> {
        const itemDb = await this.orderItemRepository.findOne({ where: { id, enabled: true } });
        if (!itemDb) {
            throw new NotFoundException('Order item not found');
        }
        itemDb.enabled = false;
        await this.orderItemRepository.update(id, itemDb);
    }
}
