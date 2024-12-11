import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPagination } from 'src/shared/types/pagination.type';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CreateOrderItemV2Dto } from './dto/create-order-item-v2.dto';
import { OrderItemV2FilterDto } from './dto/filter-order-item-v2.dto';
import { OrderItemV2Dto } from './dto/order-item-v2.dto';
import { UpdateOrderItemV2Dto } from './dto/update-order-item-v2.dto';
import { OrderItemV2Service } from './order-item-v2.service';

@ApiBearerAuth()
@ApiTags('Order Items')
@UseGuards(AuthV2Guard)
@Controller('v2/order-items')
export class OrderItemV2Controller {
    constructor(private readonly orderItemService: OrderItemV2Service) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order item' })
    @ApiResponse({ description: 'Order item created successfully', type: OrderItemV2Dto })
    async create(@Body() createOrderItemV2Dto: CreateOrderItemV2Dto): Promise<OrderItemV2Dto> {
        return this.orderItemService.create(createOrderItemV2Dto);
    }

    @Get()
    @ApiOperation({
        summary: 'Retrieve all order items with pagination',
        description: 'Returns a paginated list of order items based on provided filters.'
    })
    @ApiOkResponse({ description: 'List of order items retrieved successfully.', type: IPagination })
    async findAll(@Query() filter: OrderItemV2FilterDto): Promise<IPagination<OrderItemV2Dto>> {
        return this.orderItemService.findAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve an order item by ID' })
    @ApiResponse({ description: 'Order item found', type: OrderItemV2Dto })
    async findOne(@Param('id') id: string): Promise<OrderItemV2Dto> {
        return this.orderItemService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an order item by ID' })
    @ApiResponse({ description: 'Order item updated successfully', type: OrderItemV2Dto })
    async update(
        @Param('id') id: string,
        @Body() updateOrderItemV2Dto: UpdateOrderItemV2Dto,
    ): Promise<OrderItemV2Dto> {
        return this.orderItemService.update(id, updateOrderItemV2Dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an order item by ID' })
    @ApiResponse({ description: 'Order item deleted successfully' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.orderItemService.remove(id);
    }
}