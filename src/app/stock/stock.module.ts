import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Stock } from './entities/stock.entity';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  // Conexão com o repository do TypeORM
  imports: [TypeOrmModule.forFeature([Stock, Product])],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule { }
