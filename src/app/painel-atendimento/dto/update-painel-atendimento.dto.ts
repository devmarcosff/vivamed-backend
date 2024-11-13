import { PartialType } from '@nestjs/mapped-types';
import { CreatePainelAtendimentoDto } from './create-painel-atendimento.dto';

export class UpdatePainelAtendimentoDto extends PartialType(CreatePainelAtendimentoDto) { }
