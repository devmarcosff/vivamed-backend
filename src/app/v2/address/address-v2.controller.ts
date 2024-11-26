import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Pagination } from 'src/shared/types/pagination.type';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { AddressV2Service } from './address-v2.service';
import { AddressV2Dto } from './dto/address-v2.dto';
import { CreateAddressV2Dto } from './dto/create-address-v2.dto';
import { AddressV2FilterDto } from './dto/filter-address.dto';
import { UpdateAddressV2Dto } from './dto/update-address-v2.dto';

@ApiBearerAuth()
@ApiTags('Address')
@UseGuards(AuthV2Guard)
@Controller('v2/address')
export class AddressV2Controller {
    constructor(private readonly addressV2Service: AddressV2Service) { }

    @Get(':id')
    @ApiOperation({ summary: "Fetch a address", description: "Fetches a address by ID." })
    @ApiOkResponse({ description: "Address retrieved successfully." })
    @ApiUnauthorizedResponse({ description: "Unauthorized access." })
    findOne(@Param('id') id: string) {
        return this.addressV2Service.findOne(id);
    }

    @Get()
    @ApiOperation({ summary: "Address filter", description: "Fetches all addresses based on the filter passed to the endpoint." })
    @ApiOkResponse({ description: "Addresses retrieved successfully." })
    @ApiUnauthorizedResponse({ description: "Unauthorized access." })
    async findAll(@Query() dto: AddressV2FilterDto): Promise<Pagination<AddressV2Dto>> {
        return this.addressV2Service.findAll(dto);
    }

    @Post()
    @ApiOperation({ summary: "Create an address", description: "Creates a new address based on the provided ID." })
    @ApiCreatedResponse({ description: "Address created successfully." })
    @ApiForbiddenResponse({ description: "Forbidden." })
    @ApiUnauthorizedResponse({ description: "Unauthorized access." })
    create(@Body() dto: CreateAddressV2Dto) {
        return this.addressV2Service.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: "Update an address", description: "Updates an existing address based on the provided ID." })
    @ApiOkResponse({ description: "Address updated successfully." })
    @ApiBadRequestResponse({ description: "Invalid data or address not found." })
    @ApiUnauthorizedResponse({ description: "Unauthorized access." })
    async update(@Param('id') id: string, @Body() dto: UpdateAddressV2Dto): Promise<AddressV2Dto> {
        return this.addressV2Service.update(id, dto);
    }
}
