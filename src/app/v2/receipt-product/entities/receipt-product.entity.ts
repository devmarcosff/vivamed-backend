import { plainToClass } from 'class-transformer';
import { VivamedSmallBaseEntity } from 'src/shared/entities/vivamed-small-base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductV2 } from '../../product/entities/product.entity';
import { StockProductV2 } from '../../product/entities/stock-product.entity';
import { Receipt } from '../../receipt/entities/receipt.entity';
import { ReceiptProductDto } from '../dto/receipt-product.dto';

@Entity('receipt_products_v2')
export class ReceiptProduct extends VivamedSmallBaseEntity {

    @ManyToOne(() => ProductV2, product => product.receiptProduct)
    @JoinColumn()
    product: ProductV2;

    @ManyToOne(() => StockProductV2, stock => stock.receiptProduct)
    @JoinColumn()
    stockProduct: StockProductV2;

    @Column({ nullable: true, type: 'varchar', length: 10 })
    ncmCode: string; // Código NCM/SH

    @Column({ nullable: true, type: 'varchar', length: 5 })
    cst: string; // CST

    @Column({ nullable: true, type: 'varchar', length: 10 })
    cfopCode: string; // Código CFOP

    @Column({ type: 'varchar', length: 10 })
    unitOfMeasure: string; // Unidade de medida

    @Column({ type: 'decimal', precision: 15, scale: 3 })
    quantity: number; // Quantidade do produto

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    unitValue: number; // Valor unitário do produto

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    totalValue: number; // Valor total do produto

    // Informações de impostos
    @Column({ nullable: true, type: 'decimal', precision: 15, scale: 2 })
    bcIcms: number; // Base de cálculo ICMS

    @Column({ nullable: true, type: 'decimal', precision: 15, scale: 2 })
    vIcms: number; // Valor ICMS

    @Column({ nullable: true, type: 'decimal', precision: 15, scale: 2 })
    vIpi: number; // Valor IPI

    @Column({ nullable: true, type: 'decimal', precision: 15, scale: 2 })
    aIcms: number; // Alíquota ICMS

    @Column({ nullable: true, type: 'decimal', precision: 15, scale: 2 })
    aIpi: number; // Alíquota IPI

    @ManyToOne(() => Receipt, (receipt) => receipt.products)
    @JoinColumn()
    receipt: Receipt;

    public toDto(): ReceiptProductDto {
        return plainToClass(ReceiptProductDto, {
            id: this.id,
        });
    }
}
