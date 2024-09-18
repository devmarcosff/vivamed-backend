import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';

@Controller('consulta')
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) { }

  @Post()
  create(@Body() createConsultaDto: CreateConsultaDto) {
    return this.consultaService.create(createConsultaDto);
  }

  @Get()
  findAll() {
    return this.consultaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultaService.findOne(id);
  }

  // @Get('allconsult/:prontuario')
  // findBy(@Param('prontuario') prontuario: string) {
  //   return this.consultaService.findOne(prontuario);
  // }

  @Patch(':prontuario')
  update(@Param('prontuario') prontuario: string, @Body() updateConsultaDto: UpdateConsultaDto) {
    return this.consultaService.update(prontuario, updateConsultaDto);
  }

  @Delete(':prontuario')
  remove(@Param('prontuario') prontuario: string) {
    return this.consultaService.remove(prontuario);
  }
}
