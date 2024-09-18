import { Order } from "src/app/order/entities/order.entity";
import { Product } from "src/app/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
