import { VivamedMediumBaseEntity } from 'src/shared/entities/vivamed-medium-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { StockProductV2 } from '../../product/entities/stock-product.entity';
import { StockMovementDto } from '../dto/stock-movment.dto';


@Entity('stock_movements')
export class StockMovement extends VivamedMediumBaseEntity {
    @ManyToOne(() => StockProductV2, (stockProduct) => stockProduct.movements)
    stockProduct: StockProductV2;

    @Column({ type: 'enum', enum: ['IN', 'OUT', 'ADJUSTMENT'], default: 'IN' })
    type: 'IN' | 'OUT' | 'ADJUSTMENT';

    @Column({ type: 'decimal', precision: 15, scale: 3 })
    quantity: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    toDto(): StockMovementDto {
        return {
            id: this.id,
            type: this.type,
            quantity: this.quantity,
            description: this.description,
            createdAt: this.createdAt,
            stockProduct: this.stockProduct?.toDto(),
        };
    }
}
