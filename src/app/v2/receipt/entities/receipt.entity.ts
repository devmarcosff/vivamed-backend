import { VivamedSmallBaseEntity } from 'src/shared/entities/vivamed-small-base-entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Firm } from '../../firm/entities/firm.entity';
import { ReceiptProduct } from '../../receipt-product/entities/receipt-product.entity';
import { ReceiptDto } from '../dto/receipt.dto';

@Entity('receipts_v2')
export class Receipt extends VivamedSmallBaseEntity {
    @Column({ type: 'varchar', length: 50 })
    invoiceNumber: string;

    @Column({ type: 'varchar', length: 20 })
    invoiceSeries: string;

    @Column({ type: 'timestamp' })
    issueDateTime: Date;

    @OneToOne(() => Firm, (firm) => firm.receiptIssuerCnpj)
    @JoinColumn()
    issuerCnpj: Firm;

    @OneToOne(() => Firm, firm => firm.receiptRecipientCnpj)
    @JoinColumn()
    recipientCnpj: Firm;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    totalValue: number;

    // Informações de impostos
    @Column('decimal', { nullable: true, precision: 10, scale: 2, default: 0 })
    icmsBase: number; // Base de cálculo ICMS

    @Column('decimal', { nullable: true, precision: 10, scale: 2, default: 0 })
    icmsValue: number; // Valor ICMS

    @Column('decimal', { nullable: true, precision: 10, scale: 2, default: 0 })
    ipiValue: number; // Valor IPI

    @Column('decimal', { nullable: true, precision: 10, scale: 2, default: 0 })
    issValue: number; // Valor ISS

    @Column('decimal', { nullable: true, precision: 5, scale: 2, default: 0 })
    icmsRate: number; // Alíquota ICMS

    @Column('decimal', { nullable: true, precision: 5, scale: 2, default: 0 })
    ipiRate: number; // Alíquota IPI

    @Column('decimal', { nullable: true, precision: 5, scale: 2, default: 0 })
    issRate: number; // Alíquota ISS

    @Column({ nullable: true, type: 'varchar', length: 100 })
    barcodeOrAuthCode: string;

    @Column({ nullable: true, type: 'varchar', length: 50 })
    nfeAccessKey: string;

    @OneToMany(() => ReceiptProduct, (product) => product.receipt, { cascade: false })
    products: ReceiptProduct[];

    toDto(): ReceiptDto {
        return {
            id: this.id,
            invoiceNumber: this.invoiceNumber,
            invoiceSeries: this.invoiceSeries,
            issueDateTime: this.issueDateTime.toISOString(),
            issuerCnpj: this.issuerCnpj?.cnpj || '',
            recipientCnpj: this.recipientCnpj?.cnpj || '',
            totalValue: this.totalValue,
            icmsBase: this.icmsBase || 0,
            icmsValue: this.icmsValue || 0,
            ipiValue: this.ipiValue || 0,
            issValue: this.issValue || 0,
            icmsRate: this.icmsRate || 0,
            ipiRate: this.ipiRate || 0,
            issRate: this.issRate || 0,
            barcodeOrAuthCode: this.barcodeOrAuthCode || '',
            nfeAccessKey: this.nfeAccessKey || '',
        } as ReceiptDto;
    }

}
