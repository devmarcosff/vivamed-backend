import { IsNumber, IsString } from "class-validator";

export class CreateAddressDto {
    @IsString()
    street: string;

    @IsString()
    city: string;

    @IsNumber()
    cep: number;

    @IsNumber()
    num: number;

    @IsString()
    ubs: string;

    @IsString()
    state: string;

    @IsString()
    userId: string;
}
