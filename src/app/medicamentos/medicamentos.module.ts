import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { Consulta } from '../consulta/entities/consulta.entity';
import { Medicamento } from './entities/medicamento.entity';
import { MedicamentosController } from './medicamentos.controller';
import { MedicamentosService } from './medicamentos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Medicamento, Consulta, Cidadao])],
  controllers: [MedicamentosController],
  providers: [MedicamentosService],
})
export class MedicamentosModule { }
