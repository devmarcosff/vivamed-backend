import { IsDate, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Address } from "../../address/entities/address.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @MaxLength(11, { message: 'O cpf deve conter no mínimo 11 digitos' })
    cpf: string;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    idProf: string;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    role: string;

    @IsDate()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    birthday: Date;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres.' })
    password: string;

    @IsString()
    address: Address;
}