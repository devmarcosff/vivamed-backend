import { Product } from "src/app/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Stock {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity?: number

    @ManyToOne(() => Product, (product) => product.stocks)
    product: Product;
} 