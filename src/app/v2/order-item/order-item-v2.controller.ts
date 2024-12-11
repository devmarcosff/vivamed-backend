import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CreateOrderItemV2Dto } from './dto/create-order-item-v2.dto';
import { UpdateOrderItemV2Dto } from './dto/update-order-item-v2.dto';
import { OrderItemV2Service } from './order-item-v2.service';

@ApiBearerAuth()
@ApiTags('Orders')
@UseGuards(AuthV2Guard)
@Controller('v2/orders-itens')
export class OrderItemV2Controller {
    constructor(private readonly orderItemV2Service: OrderItemV2Service) { }

    @Post()
    create(@Body() createOrderItemV2Dto: CreateOrderItemV2Dto) {
        return this.orderItemV2Service.create(createOrderItemV2Dto);
    }

    @Get()
    findAll() {
        return this.orderItemV2Service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderItemV2Service.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOrderItemV2Dto: UpdateOrderItemV2Dto) {
        return this.orderItemV2Service.update(+id, updateOrderItemV2Dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderItemV2Service.remove(+id);
    }
}
