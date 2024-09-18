import { Address } from "src/app/address/entities/address.entity";
import { Order } from "src/app/order/entities/order.entity";

export interface IUser {
    sub: string,
    id: string,
    firstName: string,
    lastName: string,
    cpf: string,
    birthday: string,
    username: string,
    iat: number,
    exp: number,
    address: Address,
    order: Order[]
}