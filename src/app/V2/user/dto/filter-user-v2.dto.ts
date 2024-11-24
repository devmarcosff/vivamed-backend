import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";

export class UserV2FilterDto extends PaginationParamsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    cpf?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    email?: number;
}