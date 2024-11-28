import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Firm } from './entities/firm.entity';
import { FirmController } from './firm.controller';
import { FirmService } from './firm.service';

@Module({
    imports: [TypeOrmModule.forFeature([Firm])],
    controllers: [FirmController],
    providers: [FirmService],
})
export class FirmModule { }
