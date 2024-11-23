import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationParamsDto {
    @ApiPropertyOptional({ default: 1, minimum: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ default: 10, minimum: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number;
}