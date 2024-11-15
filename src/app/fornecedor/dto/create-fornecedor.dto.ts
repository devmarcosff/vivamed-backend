import { IsDate, IsString } from "class-validator";

export class CreateFornecedorDto {
    @IsDate()
    createAt: Date;
    @IsString()
    nome: string;
    @IsString()
    email: string;
    @IsString()
    contato: string;
    @IsString()
    cnpj: string;
}
