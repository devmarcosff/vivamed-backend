import { plainToClass } from 'class-transformer';
import { VivamedFullBaseEntity } from 'src/shared/entities/vivamed-full-base-entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { AddressV2 } from '../../address/entities/address-v2.entity';
import { Receipt } from '../../receipt/entities/receipt.entity';
import { VendorDto } from '../dto/vendor.dto';

@Entity('vendors_v2')
export class Vendor extends VivamedFullBaseEntity {
    @Column({ name: 'business_name', nullable: false })
    businessName: string; // Razão social

    @Column({ name: 'trade_name', nullable: true })
    tradeName?: string; // Nome fantasia

    @Column({ unique: true, nullable: false })
    cnpj: string; // CNPJ

    @Column({ nullable: true })
    phone?: string; // Telefone

    @Column({ nullable: true })
    email?: string; // Email

    @Column({ name: 'state_registration', nullable: true })
    stateRegistration?: string; // Inscrição estadual

    @Column({ name: 'municipal_registration', nullable: true })
    municipalRegistration?: string; // Inscrição municipal

    @OneToOne(() => AddressV2, address => address.vendor, { cascade: false })
    address: AddressV2;

    @OneToMany(() => Receipt, (receipt) => receipt.vendor, { cascade: false })
    receipts: Receipt[];

    public toDto(): VendorDto {
        return plainToClass(VendorDto, {
            id: this.id,
            businessName: this.businessName,
            tradeName: this.tradeName,
            cnpj: this.cnpj,
            phone: this.phone,
            email: this.email,
            stateRegistration: this.stateRegistration,
            municipalRegistration: this.municipalRegistration,
        });
    }
}
