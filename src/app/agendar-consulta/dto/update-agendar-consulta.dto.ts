import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateAgendarConsultaDto } from './create-agendar-consulta.dto';

export class UpdateAgendarConsultaDto extends PartialType(CreateAgendarConsultaDto) {
    @IsString()
    status?: string;

    @IsString()
    recorrente?: boolean;
}
