import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserV2 } from '../user/entities/user-v2.entity';
import { AuthV2Controller } from './auth-v2.controller';
import { AuthV2Service } from './auth-v2.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserV2])
    ],
    controllers: [AuthV2Controller],
    providers: [AuthV2Service],
})
export class AuthV2Module { }
