import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";

export class AddressV2FilterDto extends PaginationParamsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    street?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    zipcode?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    state?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    profileId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    citizenId?: string;
}