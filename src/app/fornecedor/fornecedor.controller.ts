import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { FornecedorService } from './fornecedor.service';

@Controller('fornecedor')
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) { }

  @Post()
  create(@Body() createFornecedorDto: CreateFornecedorDto) {
    return this.fornecedorService.create(createFornecedorDto);
  }

  @Get()
  findAll() {
    return this.fornecedorService.findAll();
  }

  @Get(':cnpj')
  findOne(@Param('cnpj') cnpj: string) {
    return this.fornecedorService.findOne(cnpj);
  }

  @Patch(':cnpj')
  update(@Param('cnpj') cnpj: string, @Body() updateFornecedorDto: UpdateFornecedorDto) {
    return this.fornecedorService.update(cnpj, updateFornecedorDto);
  }

  @Delete(':cnpj')
  remove(@Param('cnpj') cnpj: string, @Body() updateFornecedorDto: UpdateFornecedorDto) {
    return this.fornecedorService.update(cnpj, updateFornecedorDto);
  }

  @Delete(':cnpj')
  removeFornecedor(@Param('cnpj') cnpj: string) {
    return this.fornecedorService.removeFornecedor(cnpj)
  }
}
