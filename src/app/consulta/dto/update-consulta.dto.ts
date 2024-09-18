import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateConsultaDto } from './create-consulta.dto';

export class UpdateConsultaDto extends PartialType(CreateConsultaDto) {
    @IsString() @IsOptional()
    descricao?: string;
}
