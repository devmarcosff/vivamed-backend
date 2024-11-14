import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UpdatePainelAtendimentoDto } from './dto/update-painel-atendimento.dto';
import { PainelAtendimentoService } from './painel-atendimento.service';

const escpos = require('escpos');
const usb = require('escpos-usb');
escpos.USB = usb;

@Controller('painel-atendimento')
export class PainelAtendimentoController {
  constructor(private readonly painelAtendimentoService: PainelAtendimentoService) { }

  @Post()
  createTicket() {
    return this.painelAtendimentoService.createTicket();
  }

  @Post('/imprimir')
  async imprimir(@Res() res: Response) {
    try {
      const device = new escpos.USB();
      const printer = new escpos.Printer(device);

      device.open(() => {
        printer
          .align('ct')
          .text('Marcos Stevanini')
          .text('Quantidade: 1')
          .text('Valor: R$ 10.000,00')
          .cut()
          .close();
      });

      console.log('Sucesso...')
      res.status(200).json({ message: 'Impressão realizada com sucesso!' });
    } catch (error) {
      console.log('Error...', error)
      res.status(500).json({ error: 'Erro ao tentar imprimir' });
    }
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
