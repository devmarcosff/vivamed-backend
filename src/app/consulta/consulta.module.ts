import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendarConsulta } from '../agendar-consulta/entities/agendar-consulta.entity';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { User } from '../user/entities/user.entity';
import { ConsultaController } from './consulta.controller';
import { ConsultaService } from './consulta.service';
import { Consulta } from './entities/consulta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta, Cidadao, User, AgendarConsulta])],
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule { }
