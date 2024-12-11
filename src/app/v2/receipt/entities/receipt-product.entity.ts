import { VivamedSmallBaseEntity } from 'src/shared/entities/vivamed-small-base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StockProductV2 } from '../../stock-product/entities/stock-product.entity';
import { ReceiptProductDto } from '../dto/receipt-product.dto';
import { Receipt } from './receipt.entity';

@Entity('receipt_products_v2')
export class ReceiptProduct extends VivamedSmallBaseEntity {

    @ManyToOne(() => StockProductV2, stock => stock.receiptProducts)
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
    unitPrice: number; // Valor unitário do produto

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

    @ManyToOne(() => Receipt, (mto) => mto.receiptProducts)
    @JoinColumn()
    receipt: Receipt;

    toDto(): ReceiptProductDto {
        return {
            productCode: this.stockProduct?.product.code || '', // Ajuste para obter o código do produto da relação
            productBatch: this.stockProduct?.batch || '', // Ajuste para obter o lote do produto da relação
            productExpirationDate: this.stockProduct?.expirationDate || null, // Data de validade do lote
            productManufacturingDate: this.stockProduct?.manufactureDate || null, // Data de fabricação do lote
            quantity: this.quantity,
            unitPrice: this.unitPrice,
            ncmCode: this.ncmCode || '',
            cst: this.cst || '',
            cfopCode: this.cfopCode || '',
            unitOfMeasure: this.unitOfMeasure || '',
            bcIcms: this.bcIcms || 0,
            vIcms: this.vIcms || 0,
            vIpi: this.vIpi || 0,
            aIcms: this.aIcms || 0,
            aIpi: this.aIpi || 0,
        };
    }


}
