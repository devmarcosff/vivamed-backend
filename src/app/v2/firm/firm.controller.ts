import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from 'src/shared/types/pagination.type';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CreateFirmDto } from './dto/create-firm.dto';
import { FirmFilterDto } from './dto/filter-firm.dto';
import { FirmDto } from './dto/firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { FirmService } from './firm.service';

@ApiBearerAuth()
@ApiTags('Firm')
@UseGuards(AuthV2Guard)
@Controller('v2/firms')
export class FirmController {
    constructor(private readonly firmService: FirmService) { }

    @Post()
    @ApiOperation({ summary: 'Create a firm', description: 'Creates a new firm.' })
    @ApiCreatedResponse({ description: 'Firm created successfully.', type: FirmDto })
    @ApiBadRequestResponse({ description: 'Invalid data provided.' })
    async create(@Body() dto: CreateFirmDto): Promise<FirmDto> {
        return this.firmService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all firms', description: 'Retrieves a list of all firms.' })
    @ApiOkResponse({ description: 'List of firms retrieved successfully.', type: [FirmDto] })
    async findAll(@Query() filter: FirmFilterDto): Promise<IPagination<FirmDto>> {
        return this.firmService.findAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a firm', description: 'Retrieves details of a specific firm by ID.' })
    @ApiOkResponse({ description: 'Firm details retrieved successfully.', type: FirmDto })
    @ApiNotFoundResponse({ description: 'Firm not found.' })
    async findOne(@Param('id') id: string): Promise<FirmDto> {
        return this.firmService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a firm', description: 'Updates an existing firm by ID.' })
    @ApiOkResponse({ description: 'Firm updated successfully.', type: FirmDto })
    @ApiBadRequestResponse({ description: 'Invalid data or firm not found.' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateFirmDto,
    ): Promise<FirmDto> {
        return this.firmService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a firm', description: 'Deletes a firm by ID.' })
    @ApiOkResponse({ description: 'Firm deleted successfully.' })
    @ApiNotFoundResponse({ description: 'Firm not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.firmService.remove(id);
    }
}
