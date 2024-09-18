import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { AuthCidadaoController } from './auth-cidadao.controller';
import { AuthCidadaoService } from './auth-cidadao.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cidadao]),
  ],
  controllers: [AuthCidadaoController],
  providers: [AuthCidadaoService],
})
export class AuthCidadaoModule { }
