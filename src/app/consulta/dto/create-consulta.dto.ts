import { IsString } from "class-validator";

export class CreateConsultaDto {
    @IsString()
    createAt: Date;

    @IsString()
    descricao: string;

    @IsString()
    respTec: string;

    @IsString()
    role: string;

    @IsString()
    prontuario: string;

    @IsString()
    medicamento: string;
}
