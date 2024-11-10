import { IsNumber, IsString } from "class-validator";

export class CreateMedicamentoDto {
    @IsString()
    name: string;

    @IsNumber()
    manha: string;

    @IsString()
    tarde: string;

    @IsString()
    noite: string;

    @IsString()
    consulta: string;

    @IsString()
    consultas: any;
}