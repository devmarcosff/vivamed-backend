import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VivamedJwtModule } from 'src/app/vivamed-jwt-module/vivamed-jwt.module';
import { AddressV2 } from '../address/entities/address-v2.entity';
import { ProfileV2 } from './entities/profile-v2.entity';
import { ProfileV2Controller } from './profile-v2.controller';
import { ProfileV2Service } from './profile-v2.service';

@Module({
    imports: [
        VivamedJwtModule,
        TypeOrmModule.forFeature([ProfileV2, AddressV2]),
    ],
    controllers: [ProfileV2Controller],
    providers: [ProfileV2Service],
})
export class ProfileV2Module { }
