import { IsNumber, IsString } from "class-validator";

export class CreateMedicamentoDto {
    @IsString()
    prescricao: string;

    @IsNumber()
    quantidade: number;

    @IsString()
    cidadao: string;

    @IsString()
    consulta: string;
}