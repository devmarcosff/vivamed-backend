import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { Role } from "src/shared/enuns/role.enum";

export class CreateUserV2Dto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'Invalid CPF' })
    cpf: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: "Password must be more than 6 characters" })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password must contain letters, numbers, and special characters',
    })
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(Role, { message: 'User role must be Admin or User.' })
    role: Role;
}
