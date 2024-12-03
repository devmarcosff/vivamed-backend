import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovement } from './entities/stock-movment.entity';
import { StockMovmentController } from './stock-movment.controller';
import { StockMovementService } from './stock-movment.service';

@Module({
    imports: [TypeOrmModule.forFeature([StockMovement])],
    controllers: [StockMovmentController],
    providers: [StockMovementService],
    exports: [StockMovementService]
})
export class StockMovmentModule { }
