import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from 'src/shared/types/pagination.type';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { ReceiptFilterDto } from './dto/filter-receipt.dto';
import { ReceiptDto } from './dto/receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { ReceiptService } from './receipt.service';

@ApiBearerAuth()
@ApiTags('Receipt')
@UseGuards(AuthV2Guard)
@Controller('v2/receipts')
export class ReceiptController {
    constructor(private readonly receiptService: ReceiptService) { }

    @Post()
    @ApiOperation({ summary: 'Create a receipt', description: 'Creates a new receipt.' })
    @ApiCreatedResponse({ description: 'Receipt created successfully.', type: ReceiptDto })
    @ApiBadRequestResponse({ description: 'Invalid data provided.' })
    async create(@Body() dto: CreateReceiptDto): Promise<ReceiptDto> {
        return this.receiptService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all receipts', description: 'Retrieves a list of all receipts.' })
    @ApiOkResponse({ description: 'List of receipts retrieved successfully.', type: [ReceiptDto] })
    async findAll(@Query() filter: ReceiptFilterDto): Promise<IPagination<ReceiptDto>> {
        return this.receiptService.findAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a receipt', description: 'Retrieves details of a specific receipt by ID.' })
    @ApiOkResponse({ description: 'Receipt details retrieved successfully.', type: ReceiptDto })
    @ApiNotFoundResponse({ description: 'Receipt not found.' })
    async findOne(@Param('id') id: string): Promise<ReceiptDto> {
        return this.receiptService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a receipt', description: 'Updates an existing receipt by ID.' })
    @ApiOkResponse({ description: 'Receipt updated successfully.', type: ReceiptDto })
    @ApiBadRequestResponse({ description: 'Invalid data or receipt not found.' })
    async update(@Param('id') id: string, @Body() dto: UpdateReceiptDto): Promise<ReceiptDto> {
        return this.receiptService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a receipt', description: 'Deletes a receipt by ID.' })
    @ApiOkResponse({ description: 'Receipt deleted successfully.' })
    @ApiNotFoundResponse({ description: 'Receipt not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.receiptService.remove(id);
    }
}
