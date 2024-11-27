import { VivamedBaseEntity } from 'src/shared/entities/vivamed-base-entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ReceiptProduct } from '../../receipt-product/entities/receipt-product.entity';
import { Vendor } from '../../vendor/entities/vendor.entity';

@Entity('receipts_v2')
export class Receipt extends VivamedBaseEntity {
    @Column({ type: 'varchar', length: 50 })
    invoiceNumber: string;

    @Column({ type: 'varchar', length: 20 })
    invoiceSeries: string;

    @Column({ type: 'timestamp' })
    issueDateTime: Date;

    @Column({ type: 'varchar', length: 14 })
    issuerCnpj: string;

    @Column({ type: 'varchar', length: 14 })
    recipientCnpj: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    totalValue: number;

    // Informações de impostos
    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    icmsBase: number; // Base de cálculo ICMS

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    icmsValue: number; // Valor ICMS

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    ipiValue: number; // Valor IPI

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    issValue: number; // Valor ISS

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    icmsRate: number; // Alíquota ICMS

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    ipiRate: number; // Alíquota IPI

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    issRate: number; // Alíquota ISS

    @Column({ type: 'varchar', length: 100 })
    barcodeOrAuthCode: string;

    @Column({ type: 'varchar', length: 44, nullable: true })
    nfeAccessKey: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    nfeNumber: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    nfeAuthCode: string;

    @Column({ type: 'timestamp', nullable: true })
    nfeAuthDateTime: Date;

    @ManyToOne(() => Vendor, (vendor) => vendor.receipts)
    @JoinColumn()
    vendor: Vendor;

    @OneToMany(() => ReceiptProduct, (product) => product.receipt, { cascade: false })
    products: ReceiptProduct[];
}
