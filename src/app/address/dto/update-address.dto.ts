import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    @IsString() @IsOptional()
    street: string;

    @IsString() @IsOptional()
    city: string;

    @IsNumber() @IsOptional()
    cep: number;

    @IsString() @IsOptional()
    state: string;
}
