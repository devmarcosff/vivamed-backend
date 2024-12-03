import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from 'src/shared/types/pagination.type';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { StockMovementFilterDto } from './dto/filter-stock-movment.dto';
import { StockMovementDto } from './dto/stock-movment.dto';
import { StockMovementService } from './stock-movment.service';

@ApiBearerAuth()
@ApiTags('Stock Movement')
@UseGuards(AuthV2Guard)
@Controller('v2/stock-movements')
export class StockMovmentController {
    constructor(private readonly stockMovmentService: StockMovementService) { }

    @Get()
    @ApiOperation({ summary: 'Retrieve all movements with pagination', description: 'Returns a paginated list of movements based on provided filters.', })
    @ApiOkResponse({ description: 'List of movements retrieved successfully.', type: IPagination })
    async findAll(@Query() filter: StockMovementFilterDto): Promise<IPagination<StockMovementDto>> {
        return this.stockMovmentService.findAll(filter);
    }
}
