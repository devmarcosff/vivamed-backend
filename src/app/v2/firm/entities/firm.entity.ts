import { plainToClass } from 'class-transformer';
import { VivamedBigBaseEntity } from 'src/shared/entities/vivamed-full-base-entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { AddressV2 } from '../../address/entities/address-v2.entity';
import { OrderV2 } from '../../order/entities/order-v2.entity';
import { Receipt } from '../../receipt/entities/receipt.entity';
import { FirmDto } from '../dto/firm.dto';


@Entity('firm_v2')
export class Firm extends VivamedBigBaseEntity {
    @Column({ name: 'business_name', nullable: false })
    businessName: string; // Razão social

    @Column({ name: 'fantasy_name', nullable: true })
    fantasyName?: string; // Nome fantasia

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

    @OneToOne(() => AddressV2, address => address.firm, { cascade: false })
    address: AddressV2;

    @OneToMany(() => Receipt, receipt => receipt.issuerCnpj, { cascade: false })
    receiptIssuerCnpj: Receipt;

    @OneToMany(() => Receipt, receipt => receipt.recipientCnpj, { cascade: false })
    receiptRecipientCnpj: Receipt;

    @OneToMany(() => OrderV2, otm => otm.recipientFirm, { cascade: false })
    order: OrderV2;

    public toDto(): FirmDto {
        return plainToClass(FirmDto, {
            id: this.id,
            businessName: this.businessName,
            fantasyName: this.fantasyName,
            cnpj: this.cnpj,
            phone: this.phone,
            email: this.email,
            stateRegistration: this.stateRegistration,
            municipalRegistration: this.municipalRegistration,
        });
    }
}
