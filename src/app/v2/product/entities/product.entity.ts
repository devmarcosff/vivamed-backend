import { VivamedBigBaseEntity } from 'src/shared/entities/vivamed-full-base-entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { ReceiptProduct } from '../../receipt-product/entities/receipt-product.entity';
import { Receipt } from '../../receipt/entities/receipt.entity';
import { ProductV2Dto } from '../dto/product.dto';
import { StockProductV2 } from './stock-product.entity';

@Entity('product_v2')
export class ProductV2 extends VivamedBigBaseEntity {
    @Column()
    photo: string;

    @Column({ unique: true })
    code: string;

    @Column()
    name: string;

    @Column()
    activeIngredient: string; // Active substance

    @Column()
    pharmaceuticalForm: string; // Ex: tablet, syrup, capsule

    @Column()
    concentration: string; // Ex: 500mg, 10%

    @Column()
    manufacturer: string // Ex: PharmaCorp

    @Column()
    healthRegistration: string; // ANVISA/Ministry of Health registration

    @Column({ nullable: true })
    leafletUrl?: string;

    @OneToMany(() => StockProductV2, (stock) => stock.product)
    items: StockProductV2[];

    @OneToMany(() => Receipt, (receipt) => receipt.products)
    receipt: Receipt[];

    @OneToOne(() => ReceiptProduct, receiptProduct => receiptProduct.product)
    receiptProduct: ReceiptProduct;

    toDto(): ProductV2Dto {
        return {
            id: this.id,
            photo: this.photo,
            code: this.code,
            name: this.name,
            activeIngredient: this.activeIngredient,
            pharmaceuticalForm: this.pharmaceuticalForm,
            concentration: this.concentration,
            manufacturer: this.manufacturer,
            leafletUrl: this.leafletUrl,
            healthRegistration: this.healthRegistration,
        } as ProductV2Dto;
    }
}
