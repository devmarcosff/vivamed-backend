import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from 'src/shared/types/pagination.type';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { StockProductFilterDto } from './dto/filter-stock-product.dto';
import { StockProductV2Dto } from './dto/stock-product.dto';
import { StockProductService } from './stock-product.service';

@ApiBearerAuth()
@ApiTags('Stock Products')
@UseGuards(AuthV2Guard)
@Controller('v2/stock-products')
export class StockProductController {
    constructor(private readonly stockProductService: StockProductService) { }

    @Get()
    @ApiOperation({ summary: 'Retrieve all stock products with pagination', description: 'Returns a paginated list of stock products based on provided filters.' })
    @ApiOkResponse({ description: 'List of stock products retrieved successfully.', type: IPagination })
    async findAll(@Query() filter: StockProductFilterDto): Promise<IPagination<StockProductV2Dto>> {
        return this.stockProductService.findAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a stock product by ID' })
    @ApiOkResponse({ description: 'Stock product found', type: StockProductV2Dto })
    @ApiNotFoundResponse({ description: 'Stock product not found' })
    async findOne(@Param('id') id: string): Promise<StockProductV2Dto> {
        return this.stockProductService.findOne(id);
    }
}
