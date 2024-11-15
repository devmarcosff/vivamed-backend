import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
    @IsString() @IsOptional()
    street: string;

    @IsString() @IsOptional()
    city: string;

    @IsString() @IsOptional()
    cep: string;

    @IsString() @IsOptional()
    num: string;

    @IsString() @IsOptional()
    state: string;
}
