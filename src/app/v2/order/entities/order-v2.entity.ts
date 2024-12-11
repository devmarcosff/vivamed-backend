import { OrderStatus, PaymentStatus } from "src/shared/constants/order.constants";
import { VivamedBigBaseEntity } from "src/shared/entities/vivamed-full-base-entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Firm } from "../../firm/entities/firm.entity";
import { OrderItemV2 } from "../../order-item/entities/order-item-v2.entity";
import { UserV2 } from "../../user/entities/user-v2.entity";
import { OrderV2Dto } from "../dto/order-v2.dto";

@Entity('order_v2')
export class OrderV2 extends VivamedBigBaseEntity {

    @Column({ unique: true })
    number: string;

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

    @ManyToOne(() => Firm, (mto) => mto.order)
    @JoinColumn()
    recipientFirm: Firm;

    @OneToMany(() => OrderItemV2, (otm) => otm.order)
    orderItens: OrderItemV2[];

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    toDto(): OrderV2Dto {
        return {
            id: this.id,
            number: this.number,
            status: this.status,
            paymentStatus: this.paymentStatus,
            total: this.total,
            recipientFirm: this.recipientFirm?.toDto() ?? undefined,
            user: this.user?.toDto() ?? undefined,
            orderItens: this.orderItens?.map(m => m.toDto()) ?? [],
        };
    }
}
