import { IsString } from 'class-validator';
export class CreateFornecedoreDto {
    @IsString()
    nome: string;
    @IsString()
    email: string;
    @IsString()
    contato: string;
    @IsString()
    cnpj: string;
    // adress
}