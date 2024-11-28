import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";

export class CitizenFilterDto extends PaginationParamsDto {
    @ApiPropertyOptional({ description: 'Full name of the citizen', example: 'John Doe' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({ description: 'CPF of the citizen', example: '123.456.789-00' })
    @IsOptional()
    @IsString()
    cpf?: string;

    @ApiPropertyOptional({ description: 'CNS of the citizen', example: '123456789012345' })
    @IsOptional()
    @IsString()
    cns?: string;

    @ApiPropertyOptional({ description: 'Birth date of the citizen', example: '1990-01-01' })
    @IsOptional()
    @IsDateString()
    birthDate?: Date;

    @ApiPropertyOptional({ description: 'Gender of the citizen', example: 'Male' })
    @IsOptional()
    @IsString()
    gender?: string;

    @ApiPropertyOptional({ description: 'Age of the citizen', example: 30 })
    @IsOptional()
    @IsNumber()
    age?: number;

    @ApiPropertyOptional({ description: 'Weighting value', example: 1.5 })
    @IsOptional()
    @IsNumber()
    weighting?: number;

    @ApiPropertyOptional({ description: 'Type of identification', example: 'Passport' })
    @IsOptional()
    @IsString()
    identificationType?: string;

    @ApiPropertyOptional({ description: 'Last contact date', example: '2024-01-01' })
    @IsOptional()
    @IsDateString()
    lastContactDate?: Date;

    @ApiPropertyOptional({ description: 'Total services provided', example: 5 })
    @IsOptional()
    @IsNumber()
    totalServices?: number;

    @ApiPropertyOptional({ description: 'City of residence', example: 'New York' })
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional({ description: 'District of residence', example: 'Manhattan' })
    @IsOptional()
    @IsString()
    district?: string;
}
