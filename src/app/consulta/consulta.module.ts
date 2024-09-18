import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { ConsultaController } from './consulta.controller';
import { ConsultaService } from './consulta.service';
import { Consulta } from './entities/consulta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta, Cidadao])],
  controllers: [ConsultaController],
  providers: [ConsultaService],
})
export class ConsultaModule { }
