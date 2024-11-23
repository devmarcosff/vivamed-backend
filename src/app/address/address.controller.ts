import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/user/auth.guard';
import { Pagination } from 'src/shared/types/pagination.type';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressFilterDto } from './dto/filter-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiBearerAuth()
@ApiTags('Address')
@UseGuards(AuthGuard)
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post()
    create(@Body() createAddressDto: CreateAddressDto) {
        return this.addressService.create(createAddressDto);
    }

    @Post('cidadao')
    createAddressCidadao(@Body() createAddressDto: CreateAddressDto) {
        return this.addressService.createAddressCidadao(createAddressDto);
    }

    @Get()
    findAllAddress() {
        return this.addressService.findAllAddress();
    }

    @Get(':id')
    findOneAddress(@Param('id') id: number) {
        return this.addressService.findOneAddress(+id);
    }

    @Patch(':id')
    update(@Param('id') id: any, @Body() updateAddressDto: UpdateAddressDto) {
        return this.addressService.update(id, updateAddressDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.addressService.remove(+id);
    }

    @Get('v2')
    @ApiOperation({ summary: "Filtro de endereços", description: "Busca todos os endereços baseando-se no filtro passado pelo endpoint." })
    @ApiOkResponse({ description: "Endereços consultados com sucesso" })
    @ApiUnauthorizedResponse({ description: "Acesso não autorizado" })
    async findAllAddressV2(@Query() filter: AddressFilterDto): Promise<Pagination<AddressDto>> {
        return this.addressService.findAllAddressV2(filter);
    }

    @Post('v2')
    @ApiOperation({ summary: "Criar um endereço", description: "Cria um novo endereço baseando-se no Id." })
    @ApiCreatedResponse({ description: 'Endereço criado com sucesso.' })
    @ApiForbiddenResponse({ description: 'Proibido.' })
    @ApiUnauthorizedResponse({ description: "Acesso não autorizado" })
    createV2(@Body() createAddressDto: CreateAddressDto) {
        return this.addressService.createV2(createAddressDto);
    }
}
