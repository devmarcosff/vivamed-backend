import { OrderStatus, PaymentStatus } from "src/shared/constants/order.constants";
import { VivamedBigBaseEntity } from "src/shared/entities/vivamed-full-base-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { OrderItemV2 } from "../../order-item/entities/order-item-v2.entity";
import { UserV2 } from "../../user/entities/user-v2.entity";

@Entity('order_v2')
export class OrderV2 extends VivamedBigBaseEntity {

    @Column()
    number: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.INIT,
    })
    status: OrderStatus;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    @ManyToOne(() => UserV2, (mto) => mto.orders)
    @JoinColumn()
    user: UserV2;

    @OneToMany(() => OrderItemV2, (otm) => otm.order)
    orderItens: OrderItemV2[];

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;
}
