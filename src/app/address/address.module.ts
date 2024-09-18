import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/app/user/entities/user.entity';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';

@Module({
  // Conexão com o repository do TypeORM
  imports: [TypeOrmModule.forFeature([Address, User, Cidadao])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule { }
