import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateCidadaoDto {
    @IsString()
    // @IsNotEmpty({ message: 'Campo obrigatório' })
    prontuario: string;

    @IsString()
    // @IsNotEmpty({ message: 'Campo obrigatório' })
    name: string;

    @IsString()
    // @IsNotEmpty({ message: 'Campo obrigatório' })
    cpf: string;

    @IsDate()
    // @IsNotEmpty({ message: 'Campo obrigatório' })
    birthday: Date;

    @IsNumber()
    caps: boolean;

    @IsNumber()
    password: string;
}
