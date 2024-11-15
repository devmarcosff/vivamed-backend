import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FornecedoresGateway } from './fornecedores.gateway';
import { FornecedoresService } from './fornecedores.service';

@Module({

  // Conexão com o repository do TypeORM
  imports: [TypeOrmModule.forFeature([FornecedoresService])],
  controllers: [FornecedoresGateway],
  providers: [FornecedoresGateway, FornecedoresService],
  // providers: [ProductService],
})
export class FornecedoresModule { }
