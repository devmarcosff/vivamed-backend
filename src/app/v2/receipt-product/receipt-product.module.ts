import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptProduct } from './entities/receipt-product.entity';
import { ReceiptProductController } from './receipt-product.controller';
import { ReceiptProductService } from './receipt-product.service';

@Module({
    imports: [TypeOrmModule.forFeature([ReceiptProduct])],
    controllers: [ReceiptProductController],
    providers: [ReceiptProductService],
})
export class ReceiptProductModule { }
