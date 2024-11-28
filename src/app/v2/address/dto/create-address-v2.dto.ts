import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAddressV2Dto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    zipcode: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    street: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    number: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    neighborhood: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    complement?: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    latitude?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    longitude?: number;

    @ApiProperty()
    @IsString()
    profileId?: string;

    @ApiProperty()
    @IsString()
    citizenId?: string;

    @ApiProperty()
    @IsString()
    firmId?: string;
}