import { IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
    @IsString()
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'Campo obrigatório' })
    password: string;
}