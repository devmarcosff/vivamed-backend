import { Module } from '@nestjs/common';
import { AddressV2Module } from './address/address-v2.module';
import { AuthV2Module } from './auth/auth-v2.module';
import { CitizenModule } from './citizen/citizen.module';
import { ProfileV2Module } from './profile/profile-v2.module';
import { UserV2Module } from './user/user-v2.module';
import { VivamedJwtModule } from './vivamed-jwt-module/vivamed-jwt.module';

@Module({
    imports: [
        VivamedJwtModule,
        AuthV2Module,
        UserV2Module,
        ProfileV2Module,
        AddressV2Module,
        CitizenModule,
    ],
})
export class MainModule { }
