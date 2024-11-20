import { PartialType } from '@nestjs/mapped-types';
import { CreateAgendamentoTransporteDto } from './create-agendamento-transporte.dto';

export class UpdateAgendamentoTransporteDto extends PartialType(CreateAgendamentoTransporteDto) {}
