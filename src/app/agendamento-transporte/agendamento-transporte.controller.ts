import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AgendamentoTransporteService } from './agendamento-transporte.service';
import { CreateAgendamentoTransporteDto } from './dto/create-agendamento-transporte.dto';
import { UpdateAgendamentoTransporteDto } from './dto/update-agendamento-transporte.dto';

@Controller('agendamento-transporte')
export class AgendamentoTransporteController {
  constructor(private readonly agendamentoTransporteService: AgendamentoTransporteService) { }

  @Post()
  create(@Body() createAgendamentoTransporteDto: CreateAgendamentoTransporteDto) {
    return this.agendamentoTransporteService.create(createAgendamentoTransporteDto);
  }

  @Get()
  findAll() {
    return this.agendamentoTransporteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendamentoTransporteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgendamentoTransporteDto: UpdateAgendamentoTransporteDto) {
    return this.agendamentoTransporteService.update(+id, updateAgendamentoTransporteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendamentoTransporteService.remove(+id);
  }
}
