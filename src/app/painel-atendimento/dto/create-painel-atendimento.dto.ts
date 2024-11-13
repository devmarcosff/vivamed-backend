import { IsString } from "class-validator";

export class CreatePainelAtendimentoDto {
    @IsString()
    id?: string

    @IsString()
    sala?: string
}
