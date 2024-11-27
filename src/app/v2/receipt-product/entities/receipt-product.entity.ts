import { plainToClass } from 'class-transformer';
import { VivamedBaseEntity } from 'src/shared/entities/vivamed-base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Receipt } from '../../receipt/entities/receipt.entity';
import { ReceiptProductDto } from '../dto/receipt-product.dto';

@Entity('receipt_products_v2')
export class ReceiptProduct extends VivamedBaseEntity {
    @Column({ type: 'varchar', length: 20 })
    productCode: string; // Código do produto

    @Column({ type: 'varchar', length: 255 })
    description: string; // Descrição do produto

    @Column({ type: 'varchar', length: 10 })
    ncmCode: string; // Código NCM/SH

    @Column({ type: 'varchar', length: 5 })
    cst: string; // CST

    @Column({ type: 'varchar', length: 10 })
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
    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    bcIcms: number; // Base de cálculo ICMS

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    vIcms: number; // Valor ICMS

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    vIpi: number; // Valor IPI

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    aIcms: number; // Alíquota ICMS

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
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
