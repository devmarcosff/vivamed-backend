import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";

export class AddressFilterDto extends PaginationParamsDto {
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
    cep?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    state?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    citizenId?: string;
}