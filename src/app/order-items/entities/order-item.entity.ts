import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../order/entities/order.entity";
import { Product } from "../../product/entities/product.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => Product, (product) => product.orderItems)
    product: Product;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;
}
