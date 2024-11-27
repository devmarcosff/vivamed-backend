import { PartialType } from '@nestjs/swagger';
import { CreateReceiptProductDto } from './create-receipt-product.dto';

export class UpdateReceiptProductDto extends PartialType(CreateReceiptProductDto) { }
