import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Stock } from './entities/stock.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(createStockDto: CreateStockDto) {
    const product = await this.productRepository.findOne({ where: { id: createStockDto.productId }, relations: { stocks: true } })
    const currentStock = product.stocks.find(item => item.quantity > 0)

    if (currentStock) {
      await this.stockRepository.update(currentStock.id, { quantity: currentStock.quantity + createStockDto.quantity })
      return { message: 'O estoque do produto foi atualizado com sucesso.' }
    }

    const novoStock = {
      product: product,
      quantity: createStockDto.quantity,
    } as Stock

    await this.stockRepository.save(novoStock)

    return { message: 'O estoque do produto foi criado com sucesso.' };
  }

  async findAll() {
    const products = await this.stockRepository.find({
      relations: { product: true }
    });

    return products
  }

  async findOne(productId: string) {
    const stock = await this.stockRepository.findOne({ where: { product: { id: productId } } })

    return stock
  }

  update(id: number, updateStockDto: UpdateStockDto) {
    return `This action updates a #${id} stock`;
  }

  remove(id: number) {
    return `This action removes a #${id} stock`;
  }
}
