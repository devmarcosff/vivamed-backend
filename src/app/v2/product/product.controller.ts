import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPagination } from 'src/shared/types/pagination.type';
import { AuthV2Guard } from '../auth/auth-v2.guard';
import { CreateProductV2Dto } from './dto/create-product.dto';
import { ProductV2FilterDto } from './dto/filter-product.dto';
import { ProductV2Dto } from './dto/product.dto';
import { UpdateProductV2Dto } from './dto/update-product.dto';
import { ProductV2Service } from './product.service';

@ApiBearerAuth()
@ApiTags('Products')
@UseGuards(AuthV2Guard)
@Controller('v2/products')
export class ProductV2Controller {
    constructor(private readonly productService: ProductV2Service) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ description: 'Product created successfully', type: ProductV2Dto })
    async create(@Body() createProductV2Dto: CreateProductV2Dto): Promise<ProductV2Dto> {
        return this.productService.create(createProductV2Dto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all products with pagination', description: 'Returns a paginated list of products based on provided filters.', })
    @ApiOkResponse({ description: 'List of products retrieved successfully.', type: IPagination })
    async findAll(@Query() filter: ProductV2FilterDto): Promise<IPagination<ProductV2Dto>> {
        return this.productService.findAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a product by ID' })
    @ApiResponse({ description: 'Product found', type: ProductV2Dto })
    async findOne(@Param('id') id: string): Promise<ProductV2Dto> {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a product by ID' })
    @ApiResponse({ description: 'Product updated successfully', type: ProductV2Dto })
    async update(
        @Param('id') id: string,
        @Body() updateProductV2Dto: UpdateProductV2Dto,
    ): Promise<ProductV2Dto> {
        return this.productService.update(id, updateProductV2Dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product by ID' })
    @ApiResponse({ description: 'Product deleted successfully' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.productService.remove(id);
    }
}
