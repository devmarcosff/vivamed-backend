import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/app/user/entities/user.entity';
import { Address } from '../address/entities/address.entity';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { Consulta } from '../consulta/entities/consulta.entity';
import { Order } from '../order/entities/order.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, Consulta, Address, Cidadao]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
