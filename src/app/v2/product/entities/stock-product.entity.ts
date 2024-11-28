import { VivamedMediumBaseEntity } from 'src/shared/entities/vivamed-medium-entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { ReceiptProduct } from '../../receipt-product/entities/receipt-product.entity';
import { ProductV2 } from './product.entity';

@Entity('stock_product')
export class StockProductV2 extends VivamedMediumBaseEntity {
    @ManyToOne(() => ProductV2, { eager: true })
    product: ProductV2;

    @Column()
    batch: string; // Batch of the product

    @Column({ type: 'date' })
    expirationDate: Date; // Expiration date of the batch

    @Column({ type: 'date' })
    manufactureDate: Date; // Manufacture date of the batch

    @Column('int')
    quantity: number; // Quantity in stock for the batch

    @Column('decimal', { nullable: true, precision: 10, scale: 2 })
    purchasePrice?: number; // Unit purchase price

    @Column('decimal', { nullable: true, precision: 10, scale: 2 })
    salePrice?: number; // Unit sale price

    @Column({ nullable: true })
    location?: string; // Stock location

    @OneToOne(() => ReceiptProduct, receiptProduct => receiptProduct.product)
    receiptProduct: ReceiptProduct;
}
