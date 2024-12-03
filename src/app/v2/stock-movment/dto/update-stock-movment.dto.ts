import { PartialType } from '@nestjs/swagger';
import { CreateStockMovementDto } from './create-stock-movment.dto';

export class UpdateStockMovmentDto extends PartialType(CreateStockMovementDto) { }
