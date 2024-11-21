import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { Fornecedor } from '../fornecedor/entities/fornecedor.entity';
import { User } from '../user/entities/user.entity';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';

@Module({
  // Conexão com o repository do TypeORM
  imports: [TypeOrmModule.forFeature([Address, User, Cidadao, Fornecedor])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule { }
