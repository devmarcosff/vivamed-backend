import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateAddressV2Dto } from "../../address/dto/create-address-v2.dto";

export class CreateProfileV2Dto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsDateString()
    birthday: Date;

    @ApiProperty()
    @IsOptional()
    @IsString()
    picture?: string;

    @ApiProperty()
    @IsNotEmpty()
    address?: CreateAddressV2Dto;
}