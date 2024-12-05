import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RequestResetPasswordDto {
    @ApiProperty()
    @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'Invalid CPF' })
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
    @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'Invalid CPF' })
    cpf?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password must contain letters, numbers, and characters',
    })
    newPassword: string;
}
