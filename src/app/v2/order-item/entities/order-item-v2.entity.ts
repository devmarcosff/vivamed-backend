import { VivamedMediumBaseEntity } from "src/shared/entities/vivamed-medium-entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { OrderV2 } from "../../order/entities/order-v2.entity";
import { StockProductV2 } from "../../stock-product/entities/stock-product.entity";

@Entity('order_item_v2')
export class OrderItemV2 extends VivamedMediumBaseEntity {
    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => StockProductV2, (mto) => mto.orderItens)
    @JoinColumn()
    stockProduct: StockProductV2;

    @ManyToOne(() => OrderV2, (mto) => mto.orderItens)
    @JoinColumn()
    order: OrderV2;
}
