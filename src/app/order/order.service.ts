import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/shared/interfaces/user.interface';
import { Repository } from 'typeorm';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Product } from '../product/entities/product.entity';
import { Stock } from '../stock/entities/stock.entity';
import { User } from '../user/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>
  ) { }
  async create(createOrderDto: CreateOrderDto, currentUser: IUser) {
    delete currentUser.sub, currentUser.iat, currentUser.exp
    const product = await this.productRepository.findOne({ where: { id: createOrderDto.productId }, relations: { stocks: true } })
    const user: User = {
      id: currentUser.id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      cpf: currentUser.cpf,
      birthday: new Date(currentUser.birthday),
      username: currentUser.username,
      password: undefined,
      address: currentUser.address,
      orders: currentUser.order
    }

    if (!product.stocks.length) throw new NotAcceptableException('Produto não possui estoque.')
    const currentStock = product.stocks.find(item => item.quantity > 0)
    const newOrder = await this.orderRepository.save({
      total: product.price * createOrderDto.quantity,
      user: user
    })

    await this.orderItemRepository.save({
      order: newOrder,
      quantity: createOrderDto.quantity,
      product: product,
      price: product.price
    })

    await this.stockRepository.update(currentStock.id, { quantity: currentStock.quantity - createOrderDto.quantity })

    return 'Ordem cadastrada com sucesso.';
  }

  async findAll() {
    const order = await this.orderRepository.find({ relations: { items: true } })
    return order;
  }

  async findOne(id: number) {
    const order = await this.orderRepository.find({ where: { id: 'asd' }, relations: { items: true } })
    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
