import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RequestResetPasswordDto {
    @ApiProperty()
    @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'CPF inválido' })
    cpf?: string;

    @ApiProperty()
    @IsEmail()
    email?: string;
}

export class ResetPasswordDto {
    @ApiProperty()
    @IsEmail()
    email?: string;

    @ApiProperty()
    @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'CPF inválido' })
    cpf?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: "A senha deve ter mais de 6 caracteres" })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'A senha deve conter letras, numeros e caracteres',
    })
    newPassword: string;
}