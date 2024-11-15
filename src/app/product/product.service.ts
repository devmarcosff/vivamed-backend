import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {
    const novoProduct = {
      name: 'Rivotril',
      price: 32
    } as Product

    await this.productRepository.save(novoProduct)

    return 'Criado com sucesso';
  }

  async findAll() {
    const products = await this.productRepository.find({ relations: { stocks: true } })
    if (!products) throw new NotAcceptableException('Nenhum produto encontrado.')

    const product =
      products.map(item => ({
        total: item.stocks.reduce((acc, stock) => acc + (stock?.quantity ?? 0), 0),
        valorTotal: item.stocks.reduce((acc, stock) => acc + (stock?.quantity ?? 0), 0) * item.price,
        ...item
      }))

    return product;
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } })
    if (!product) throw new NotAcceptableException(`Produto com o id ${id} encontrado.`)

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
