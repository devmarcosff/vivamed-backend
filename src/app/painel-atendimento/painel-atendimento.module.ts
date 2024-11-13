import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PainelAtendimento } from './entities/painel-atendimento.entity';
import { PainelAtendimentoGateway } from './gateway/painel-atendimento.gateway';
import { PainelAtendimentoController } from './painel-atendimento.controller';
import { PainelAtendimentoService } from './painel-atendimento.service';

@Module({
  imports: [TypeOrmModule.forFeature([PainelAtendimento])],
  controllers: [PainelAtendimentoController],
  providers: [PainelAtendimentoService, PainelAtendimentoGateway],
})
export class PainelAtendimentoModule { }
