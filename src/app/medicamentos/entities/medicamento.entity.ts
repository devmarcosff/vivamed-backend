
import { Consulta } from "src/app/consulta/entities/consulta.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Medicamento {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    manha: string;

    @Column()
    tarde: string;

    @Column()
    noite: string;

    @Column()
    consulta: string;

    @ManyToOne(() => Consulta, consulta => consulta.medicamentos)
    consultas: Consulta;
}
