import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VivamedJwtModule } from 'src/app/vivamed-jwt-module/vivamed-jwt.module';
import { ProfileV2 } from '../profile/entities/profile-v2.entity';
import { UserV2 } from './entities/user-v2.entity';
import { UserV2Controller } from './user-v2.controller';
import { UserV2Service } from './user-v2.service';

@Module({
    imports: [
        VivamedJwtModule,
        TypeOrmModule.forFeature([UserV2, ProfileV2]),
    ],
    controllers: [UserV2Controller],
    providers: [UserV2Service],
})
export class UserV2Module { }
