import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockProductV2 } from './entities/stock-product.entity';
import { StockProductController } from './stock-product.controller';
import { StockProductService } from './stock-product.service';

@Module({
    imports: [TypeOrmModule.forFeature([StockProductV2])],
    controllers: [StockProductController],
    providers: [StockProductService],
})
export class StockProductModule { }
