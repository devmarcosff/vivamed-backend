import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VivamedJwtModule } from 'src/app/vivamed-jwt-module/vivamed-jwt.module';
import { AddressV2Controller } from './address-v2.controller';
import { AddressV2Service } from './address-v2.service';
import { AddressV2 } from './entities/address-v2.entity';

@Module({
    imports: [
        VivamedJwtModule,
        TypeOrmModule.forFeature([AddressV2]),
    ],
    controllers: [AddressV2Controller],
    providers: [AddressV2Service],
})
export class AddressV2Module { }
