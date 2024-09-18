import { IsNotEmpty, IsString } from "class-validator";

export class CreateAuthCidadaoDto {
    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    prontuario: string;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    password: string;
}
