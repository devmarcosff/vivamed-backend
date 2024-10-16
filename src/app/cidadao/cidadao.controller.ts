import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CidadaoService } from './cidadao.service';
import { CreateCidadaoDto } from './dto/create-cidadao.dto';
import { UpdateCidadaoDto } from './dto/update-cidadao.dto';

// @UseGuards(AuthGuard)
@Controller('cidadao')
export class CidadaoController {
  constructor(private readonly cidadaoService: CidadaoService) { }

  @Post()
  create(@Body() createCidadaoDto: CreateCidadaoDto) {
    return this.cidadaoService.create(createCidadaoDto);
  }

  @Get()
  findAll() {
    return this.cidadaoService.findAll();
  }

  @Get(':prontuario')
  findByProntuario(@Param('prontuario') prontuario: string) {
    return this.cidadaoService.findByProntuario(+prontuario);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCidadaoDto: UpdateCidadaoDto) {
    return this.cidadaoService.update(+id, updateCidadaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cidadaoService.remove(+id);
  }
}
