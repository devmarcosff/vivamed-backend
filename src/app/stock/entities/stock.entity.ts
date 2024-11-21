import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";

@Entity()
export class Stock {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity?: number

    @ManyToOne(() => Product, (product) => product.stocks)
    product: Product;
} 