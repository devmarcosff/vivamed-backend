import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AgendarConsultaService } from './agendar-consulta.service';
import { CreateAgendarConsultaDto } from './dto/create-agendar-consulta.dto';
import { UpdateAgendarConsultaDto } from './dto/update-agendar-consulta.dto';

@Controller('agendasconsulta')
export class AgendarConsultaController {
  constructor(private readonly agendarConsultaService: AgendarConsultaService) { }

  @Post()
  create(@Body() createAgendarConsultaDto: CreateAgendarConsultaDto) {
    return this.agendarConsultaService.create(createAgendarConsultaDto);
  }

  @Get()
  findAll() {
    return this.agendarConsultaService.findAll();
  }

  @Get('/todos')
  findAllAgendamentosDia() {
    return this.agendarConsultaService.findAllAgendamentosDia();
  }

  @Get('/todos/:prontuario')
  buscarTodosAgendamentosDia(@Param('prontuario') prontuario: string) {
    return this.agendarConsultaService.buscarTodosAgendamentosDia(prontuario);
  }

  @Get(':id')
  findByProntuario(@Param('id') id: string) {
    return this.agendarConsultaService.findByProntuario(id);
  }

  @Get('/hoje/:prontuario')
  buscarAgendamentoDia(@Param('prontuario') prontuario: string) {
    return this.agendarConsultaService.buscarAgendamentoDia(prontuario);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgendarConsultaDto: UpdateAgendarConsultaDto) {
    return this.agendarConsultaService.update(+id, updateAgendarConsultaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendarConsultaService.remove(id);
  }
}
