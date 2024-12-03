import { VivamedMediumBaseEntity } from 'src/shared/entities/vivamed-medium-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ReceiptProduct } from '../../receipt/entities/receipt-product.entity';
import { StockMovement } from '../../stock-movment/entities/stock-movment.entity';
import { StockProductV2Dto } from '../dto/stock-product.dto';
import { ProductV2 } from './product.entity';

@Entity('stock_product')
export class StockProductV2 extends VivamedMediumBaseEntity {
    @Column()
    batch: string; // Batch of the product

    @Column({ type: 'date' })
    expirationDate: Date; // Expiration date of the batch

    @Column({ type: 'date' })
    manufactureDate: Date; // Manufacture date of the batch

    @Column('int')
    quantity: number; // Quantity in stock for the batch

    @Column('decimal', { nullable: true, precision: 10, scale: 2 })
    unitPrice?: number; // Unit purchase price

    @Column('decimal', { nullable: true, precision: 10, scale: 2 })
    salePrice?: number; // Unit sale price

    @Column({ nullable: true })
    location?: string; // Stock location

    @ManyToOne(() => ProductV2, mto => mto.stockProducts)
    @JoinColumn()
    product: ProductV2;

    @OneToMany(() => ReceiptProduct, (otm) => otm.receipt,)
    receiptProducts: ReceiptProduct[];

    @OneToMany(() => StockMovement, (movement) => movement.stockProduct)
    movements: StockMovement[];

    toDto(): StockProductV2Dto {
        return {
            batch: this.batch,
            expirationDate: this.expirationDate,
            manufactureDate: this.manufactureDate,
            quantity: this.quantity,
            unitPrice: this.unitPrice,
            salePrice: this.salePrice,
            location: this.location,
            product: this.product?.toDto(),
            receiptProducts: this.receiptProducts?.map(receiptProduct => receiptProduct.toDto()),
            movements: this.movements?.map(movement => movement.toDto()),
        };
    }

    calculateStockMovement(): number {
        return this.movements?.reduce((total, movement) => {
            if (movement.type === 'IN') return total + movement.quantity;
            if (movement.type === 'OUT') return total - movement.quantity;
            return total;
        }, 0) || 0;
    }
}
