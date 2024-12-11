import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CreateOrderV2Dto } from './dto/create-order-v2.dto';
import { UpdateOrderV2Dto } from './dto/update-order-v2.dto';
import { OrderV2Service } from './order-v2.service';

@ApiBearerAuth()
@ApiTags('Orders')
@UseGuards(AuthV2Guard)
@Controller('v2/orders')
export class OrderV2Controller {
    constructor(private readonly orderV2Service: OrderV2Service) { }

    @Post()
    create(@Body() createOrderV2Dto: CreateOrderV2Dto) {
        return this.orderV2Service.create(createOrderV2Dto);
    }

    @Get()
    findAll() {
        return this.orderV2Service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderV2Service.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOrderV2Dto: UpdateOrderV2Dto) {
        return this.orderV2Service.update(+id, updateOrderV2Dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderV2Service.remove(+id);
    }
}
