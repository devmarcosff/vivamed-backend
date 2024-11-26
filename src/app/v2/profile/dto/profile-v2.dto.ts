import { AddressV2Dto } from "../../address/dto/address-v2.dto";

export class ProfileV2Dto {
    id: string;
    name: string;
    birthday: Date;
    picture?: string;
    address?: AddressV2Dto;
}