import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentStatus } from "../../../shared/constants/order.constants";
import { OrderItem } from "../../order-items/entities/order-item.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    items: OrderItem[];

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;
}
