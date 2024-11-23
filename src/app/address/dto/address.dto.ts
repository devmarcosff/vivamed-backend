import { IsNumber, IsString } from "class-validator";

export class AddressDto {
    @IsString()
    street: string;

    @IsString()
    city: string;

    @IsNumber()
    cep: number;

    @IsNumber()
    num: number;

    @IsString()
    state: string;

    @IsString()
    userId?: string;

    @IsString()
    citizenId?: string;
}
