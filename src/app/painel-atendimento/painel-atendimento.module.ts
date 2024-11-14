import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PainelAtendimentoGateway } from '../websocket/painel-atendimento.gateway';
import { PainelAtendimento } from './entities/painel-atendimento.entity';
import { PainelAtendimentoController } from './painel-atendimento.controller';
import { PainelAtendimentoService } from './painel-atendimento.service';

@Module({
  imports: [TypeOrmModule.forFeature([PainelAtendimento])],
  controllers: [PainelAtendimentoController],
  providers: [PainelAtendimentoService, PainelAtendimentoGateway],
})
export class PainelAtendimentoModule { }
