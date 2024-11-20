import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendamentoTransporteController } from './agendamento-transporte.controller';
import { AgendamentoTransporteService } from './agendamento-transporte.service';
import { AgendamentoTransporte } from './entities/agendamento-transporte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgendamentoTransporte])],
  controllers: [AgendamentoTransporteController],
  providers: [AgendamentoTransporteService],
})
export class AgendamentoTransporteModule { }
