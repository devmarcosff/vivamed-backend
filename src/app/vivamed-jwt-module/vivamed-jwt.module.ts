import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { VivamedJwtConfigService } from './jwt-config.service';
import { VivamedJwtService } from './jwt.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            useClass: VivamedJwtConfigService,
        }),
    ],
    providers: [VivamedJwtService, VivamedJwtConfigService],
    exports: [VivamedJwtService],
})
export class VivamedJwtModule { }
