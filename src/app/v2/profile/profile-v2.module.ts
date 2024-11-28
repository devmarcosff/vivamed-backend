import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileV2 } from './entities/profile-v2.entity';
import { ProfileV2Controller } from './profile-v2.controller';
import { ProfileV2Service } from './profile-v2.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProfileV2]),
    ],
    controllers: [ProfileV2Controller],
    providers: [ProfileV2Service],
})
export class ProfileV2Module { }
