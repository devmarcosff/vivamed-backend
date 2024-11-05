import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { User } from '../user/entities/user.entity';
import { AgendarConsultaController } from './agendar-consulta.controller';
import { AgendarConsultaService } from './agendar-consulta.service';
import { AgendarConsulta } from './entities/agendar-consulta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgendarConsulta, Cidadao, User])],
  controllers: [AgendarConsultaController],
  providers: [AgendarConsultaService],
})
export class AgendarConsultaModule { }
