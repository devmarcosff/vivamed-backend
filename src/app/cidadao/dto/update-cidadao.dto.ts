import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateCidadaoDto } from './create-cidadao.dto';

export class UpdateCidadaoDto extends PartialType(CreateCidadaoDto) {
    @IsString() @IsOptional()
    prontuario: string;

    @IsString() @IsOptional()
    firstName: string;

    @IsString() @IsOptional()
    cpf: string;

    @IsDate() @IsOptional()
    birthday: Date;

    @IsNumber() @IsOptional()
    caps: boolean;

    @IsString() @IsOptional()
    password: string;
}