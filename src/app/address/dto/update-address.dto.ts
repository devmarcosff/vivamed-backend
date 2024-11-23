import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    @IsOptional()
    @IsString()
    street: string;

    @IsOptional()
    @IsString()
    city: string;

    @IsOptional()
    @IsNumber()
    cep: number;

    @IsOptional()
    @IsNumber()
    num: number;

    @IsOptional()
    @IsString()
    state: string;
}
