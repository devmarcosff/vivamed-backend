import { IsString } from "class-validator";

export class CreateAddressDto {
    @IsString()
    street: string;

    @IsString()
    city: string;

    @IsString()
    cep: string;

    @IsString()
    num: string;

    @IsString()
    state: string;

    @IsString()
    userId?: string;
}
