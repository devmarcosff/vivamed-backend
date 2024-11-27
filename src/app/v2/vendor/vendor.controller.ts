import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPagination } from 'src/shared/types/pagination.type';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorFilterDto } from './dto/filter-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorDto } from './dto/vendor.dto';
import { VendorService } from './vendor.service';

@ApiBearerAuth()
@ApiTags('Vendor')
@UseGuards(AuthV2Guard)
@Controller('v2/vendors')
export class VendorController {
    constructor(private readonly vendorService: VendorService) { }

    @Post()
    @ApiOperation({ summary: 'Create a vendor', description: 'Creates a new vendor.' })
    @ApiCreatedResponse({ description: 'Vendor created successfully.', type: VendorDto })
    @ApiBadRequestResponse({ description: 'Invalid data provided.' })
    async create(@Body() dto: CreateVendorDto): Promise<VendorDto> {
        return this.vendorService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all vendors', description: 'Retrieves a list of all vendors.' })
    @ApiOkResponse({ description: 'List of vendors retrieved successfully.', type: [VendorDto] })
    async findAll(@Query() filter: VendorFilterDto): Promise<IPagination<VendorDto>> {
        return this.vendorService.findAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a vendor', description: 'Retrieves details of a specific vendor by ID.' })
    @ApiOkResponse({ description: 'Vendor details retrieved successfully.', type: VendorDto })
    @ApiNotFoundResponse({ description: 'Vendor not found.' })
    async findOne(@Param('id') id: string): Promise<VendorDto> {
        return this.vendorService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a vendor', description: 'Updates an existing vendor by ID.' })
    @ApiOkResponse({ description: 'Vendor updated successfully.', type: VendorDto })
    @ApiBadRequestResponse({ description: 'Invalid data or vendor not found.' })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateVendorDto,
    ): Promise<VendorDto> {
        return this.vendorService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a vendor', description: 'Deletes a vendor by ID.' })
    @ApiOkResponse({ description: 'Vendor deleted successfully.' })
    @ApiNotFoundResponse({ description: 'Vendor not found.' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.vendorService.remove(id);
    }
}
