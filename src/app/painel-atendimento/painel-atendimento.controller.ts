import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdatePainelAtendimentoDto } from './dto/update-painel-atendimento.dto';
import { PainelAtendimentoService } from './painel-atendimento.service';

@Controller('painel-atendimento')
export class PainelAtendimentoController {
  constructor(private readonly painelAtendimentoService: PainelAtendimentoService) { }

  @Post()
  createTicket() {
    return this.painelAtendimentoService.createTicket();
  }

  @Get()
  getAllTickets() {
    return this.painelAtendimentoService.getAllTickets();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.painelAtendimentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePainelAtendimentoDto: UpdatePainelAtendimentoDto) {
    return this.painelAtendimentoService.update(+id, updatePainelAtendimentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.painelAtendimentoService.remove(+id);
  }
}
