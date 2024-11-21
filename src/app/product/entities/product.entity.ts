import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "../../order-items/entities/order-item.entity";
import { Stock } from "../../stock/entities/stock.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Stock, (stock) => stock.product)
  @JoinColumn()
  stocks: Stock[];
}