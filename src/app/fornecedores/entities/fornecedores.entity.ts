import { Column } from "typeorm";

export class Fornecedores {
    @Column()
    nome: string;
    @Column()
    email?: string;
    @Column()
    contato?: string;
    @Column()
    cnpj: string;
}
