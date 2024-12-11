import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPagination } from 'src/shared/types/pagination.type';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CreateOrderV2Dto } from './dto/create-order-v2.dto';
import { OrderV2FilterDto } from './dto/filter-create-order-v2.dto';
import { OrderV2Dto } from './dto/order-v2.dto';
import { UpdateOrderV2Dto } from './dto/update-order-v2.dto';
import { OrderV2Service } from './order-v2.service';

@ApiBearerAuth()
@ApiTags('Orders')
@UseGuards(AuthV2Guard)
@Controller('v2/orders')
export class OrderV2Controller {
    constructor(private readonly orderService: OrderV2Service) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ description: 'Order created successfully', type: OrderV2Dto })
    async create(@Body() createOrderV2Dto: CreateOrderV2Dto): Promise<OrderV2Dto> {
        return this.orderService.create(createOrderV2Dto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all orders with pagination', description: 'Returns a paginated list of orders based on provided filters.' })
    @ApiOkResponse({ description: 'List of orders retrieved successfully.', type: IPagination })
    async findAll(@Query() filter: OrderV2FilterDto): Promise<IPagination<OrderV2Dto>> {
        return this.orderService.findAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve an order by ID' })
    @ApiResponse({ description: 'Order found', type: OrderV2Dto })
    async findOne(@Param('id') id: string): Promise<OrderV2Dto> {
        return this.orderService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an order by ID' })
    @ApiResponse({ description: 'Order updated successfully', type: OrderV2Dto })
    async update(
        @Param('id') id: string,
        @Body() updateOrderV2Dto: UpdateOrderV2Dto,
    ): Promise<OrderV2Dto> {
        return this.orderService.update(id, updateOrderV2Dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an order by ID' })
    @ApiResponse({ description: 'Order deleted successfully' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.orderService.remove(id);
    }
}