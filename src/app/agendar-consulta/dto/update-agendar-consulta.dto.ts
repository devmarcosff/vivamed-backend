import { PartialType } from '@nestjs/mapped-types';
import { CreateAgendarConsultaDto } from './create-agendar-consulta.dto';

export class UpdateAgendarConsultaDto extends PartialType(CreateAgendarConsultaDto) {}
