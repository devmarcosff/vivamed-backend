import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';

@Module({
    imports: [TypeOrmModule.forFeature([Receipt])],
    controllers: [ReceiptController],
    providers: [ReceiptService],
})
export class ReceiptModule { }
