import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../address/entities/address.entity';
import { CidadaoController } from './cidadao.controller';
import { CidadaoService } from './cidadao.service';
import { Cidadao } from './entities/cidadao.entity';

@Module({
  // Conexão com o repository do TypeORM
  imports: [TypeOrmModule.forFeature([Cidadao, Address])],
  controllers: [CidadaoController],
  providers: [CidadaoService],
})
export class CidadaoModule { }
