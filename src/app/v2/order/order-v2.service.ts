import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, In, Repository } from 'typeorm';
import { Firm } from '../firm/entities/firm.entity';
import { OrderItemV2 } from '../order-item/entities/order-item-v2.entity';
import { StockProductV2 } from '../stock-product/entities/stock-product.entity';
import { CreateOrderV2Dto } from './dto/create-order-v2.dto';
import { OrderV2FilterDto } from './dto/filter-create-order-v2.dto';
import { OrderV2Dto } from './dto/order-v2.dto';
import { UpdateOrderV2Dto } from './dto/update-order-v2.dto';
import { OrderV2 } from './entities/order-v2.entity';

@Injectable()
export class OrderV2Service {
    constructor(
        @InjectRepository(OrderV2)
        private readonly orderRepository: Repository<OrderV2>,
        private dataSource: DataSource,
    ) { }

    async create(dto: CreateOrderV2Dto): Promise<OrderV2Dto> {
        return this.dataSource.transaction(async (manager) => {
            const oRepository = manager.getRepository(OrderV2);
            const oiRepository = manager.getRepository(OrderItemV2);
            const spRepository = manager.getRepository(StockProductV2);
            const fRepository = manager.getRepository(Firm);

            let numberExist = false;
            let nextNumber = "";
            do {
                nextNumber = this.generateOrderNumber();
                const existsBy = await oRepository.existsBy({ number: nextNumber });
                numberExist = existsBy;
            }
            while (numberExist);

            const firm = await fRepository.findOneBy({ id: dto.firmId });

            if (!firm) {
                throw new NotFoundException(`Recipient firm not found`);
            }

            const newOrder = oRepository.create({
                number: nextNumber,
                recipientFirm: firm
            });
            const savedOrder = await oRepository.save(newOrder);

            const stocksDb = await spRepository.findBy({ id: In(dto.items.map(m => m.stockProductId)) });

            const orderItems = dto.items.map(item => {

                const stock = stocksDb.find(f => f.id == item.stockProductId);

                if (!stock) {
                    throw new NotFoundException(`Stock product with ID ${item.stockProductId} not found`);
                }

                if (item.quantity === 0) {
                    throw new NotFoundException('Item quantity cannot be zero');
                }

                const newOrderItem = {
                    order: savedOrder,
                    quantity: item.quantity,
                    price: stock.unitPrice * item.quantity,
                    stockProduct: stock,
                } as OrderItemV2;

                return oiRepository.create(newOrderItem);
            });

            await oiRepository.save(orderItems);

            savedOrder.total = orderItems.reduce((sum, item) => sum + item.price, 0);
            await oRepository.save(savedOrder);

            return savedOrder.toDto();
        });
    }

    generateOrderNumber(): string {
        const prefix = '55';
        const middle = Math.floor(Math.random() * 1_000_000_000); // Gera um número aleatório com até 9 dígitos
        const suffix = Math.floor(Math.random() * 1_000_000_000); // Gera um número aleatório com até 9 dígitos
        return `${prefix}-${middle.toString().padStart(9, '0')}-${suffix.toString().padStart(7, '0')}`;
    }

    async findAll(filter: OrderV2FilterDto): Promise<IPagination<OrderV2Dto>> {
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        const where: any = { enabled: true };

        if (filter.number) where.number = filter.number;
        if (filter.status) where.status = filter.status;
        if (filter.paymentStatus) where.paymentStatus = filter.paymentStatus;

        const [items, total] = await this.orderRepository.findAndCount({
            where,
            relations: ['user', 'orderItens'],
            take: limit,
            skip: skip,
            order: { number: 'ASC' },
        });

        const orderDtos = items.map(order => order.toDto());

        return {
            items: orderDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<OrderV2Dto> {
        const order = await this.orderRepository.findOne({
            where: { id, enabled: true },
            relations: ['user', 'orderItens']
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order.toDto();
    }

    async update(id: string, dto: UpdateOrderV2Dto): Promise<OrderV2Dto> {
        return this.dataSource.transaction(async (manager) => {
            const oRepository = manager.getRepository(OrderV2);

            const orderToUpdate = await oRepository.findOne({ where: { id } });

            if (!orderToUpdate) {
                throw new NotFoundException('Order not found');
            }

            if (dto.status) {
                orderToUpdate.status = dto.status;
            }

            if (dto.paymentStatus) {
                orderToUpdate.paymentStatus = dto.paymentStatus;
            }

            await oRepository.update(id, orderToUpdate);

            return orderToUpdate.toDto();
        });
    }


    async remove(id: string): Promise<void> {
        const itemDb = await this.orderRepository.findOne({ where: { id, enabled: true } });

        if (!itemDb) {
            throw new NotFoundException('Order not found');
        }

        itemDb.enabled = false;
        await this.orderRepository.update(id, itemDb);
    }

}