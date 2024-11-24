import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/user/auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
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
}
