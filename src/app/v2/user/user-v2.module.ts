import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserV2 } from './entities/user-v2.entity';
import { UserV2Controller } from './user-v2.controller';
import { UserV2Service } from './user-v2.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserV2]),
    ],
    controllers: [UserV2Controller],
    providers: [UserV2Service],
})
export class UserV2Module { }
