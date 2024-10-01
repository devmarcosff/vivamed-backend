import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    @IsString() @IsOptional()
    street: string;

    @IsString() @IsOptional()
    city: string;

    @IsNumber() @IsOptional()
    cep: number;

    @IsNumber() @IsOptional()
    num: number;

    @IsString() @IsOptional()
    state: string;
}
