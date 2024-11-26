import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { Role } from "src/shared/enuns/role.enum";

export class CreateUserV2Dto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nome: string;

    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'CPF inválido' })
    cpf: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: "A senha deve ter mais de 6 caracteres" })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'A senha deve conter letras, numeros e caracteres',
    })
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(Role, { message: 'O papel do usuário deve ser Admin ou User.' })
    role: Role;

}