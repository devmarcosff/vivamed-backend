import { Address } from "../../app/address/entities/address.entity";
import { Order } from "../../app/order/entities/order.entity";

export interface IUser {
    sub: string,
    id: string,
    name: string,
    cpf: string,
    birthday: string,
    username: string,
    active: string,
    idProf: string,
    role: string,
    iat: number,
    exp: number,
    address: Address,
    order: Order[]
}