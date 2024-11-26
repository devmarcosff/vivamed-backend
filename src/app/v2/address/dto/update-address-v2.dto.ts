import { PartialType } from '@nestjs/swagger';
import { CreateAddressV2Dto } from './create-address-v2.dto';

export class UpdateAddressV2Dto extends PartialType(CreateAddressV2Dto) {}
