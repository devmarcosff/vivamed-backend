
import { Consulta } from "src/app/consulta/entities/consulta.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Medicamento {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    prescricao: string;

    @Column()
    quantidade: number;

    @Column()
    cidadao: string;

    @ManyToOne(() => Consulta, consulta => consulta.medicamentos)
    consultas: Consulta;
}
