import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductV2 } from './entities/product.entity';
import { StockProductV2 } from './entities/stock-product.entity';
import { ProductV2Controller } from './product.controller';
import { ProductV2Service } from './product.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductV2, StockProductV2])],
    controllers: [ProductV2Controller],
    providers: [ProductV2Service],
})
export class ProductV2Module { }
