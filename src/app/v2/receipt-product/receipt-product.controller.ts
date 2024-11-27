import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { IPagination } from 'src/shared/types/pagination.type';
import { CreateReceiptProductDto } from './dto/create-receipt-product.dto';
import { ReceiptProductFilterDto } from './dto/filter-receipt-product.dto';
import { ReceiptProductDto } from './dto/receipt-product.dto';
import { UpdateReceiptProductDto } from './dto/update-receipt-product.dto';
import { ReceiptProductService } from './receipt-product.service';

@Controller('receipt-product')


export class ReceiptProductController {
    constructor(private readonly receiptProductService: ReceiptProductService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new receipt product', description: 'Create a new receipt product associated with a receipt.' })
    @ApiBody({ type: CreateReceiptProductDto })
    @ApiResponse({ description: 'Receipt product created successfully', type: ReceiptProductDto })
    async create(@Body() createReceiptProductDto: CreateReceiptProductDto): Promise<ReceiptProductDto> {
        return this.receiptProductService.create(createReceiptProductDto);
    }


    @Get()
    @ApiOperation({ summary: 'Get all receipt products', description: 'Retrieve all receipt products with optional filters and pagination.' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiQuery({ name: 'productCode', required: false, type: String, description: 'Filter by product code' })
    @ApiQuery({ name: 'description', required: false, type: String, description: 'Filter by product description' })
    @ApiOkResponse({ description: 'List of receipt products successfully retrieved' })
    async findAll(
        @Query() filter: ReceiptProductFilterDto
    ): Promise<IPagination<ReceiptProductDto>> {
        return this.receiptProductService.findAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific receipt product', description: 'Retrieve detailed information for a receipt product by its unique identifier.' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved receipt product details' })
    @ApiResponse({ status: 404, description: 'Receipt product not found' })
    findOne(@Param('id') id: string) {
        return this.receiptProductService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateReceiptProductDto: UpdateReceiptProductDto) {
        return this.receiptProductService.update(id, updateReceiptProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.receiptProductService.remove(id);
    }
}
