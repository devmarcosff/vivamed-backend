import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';
import { MedicamentosService } from './medicamentos.service';

@Controller('medicamentos')
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) { }

  @Post()
  create(@Body() createMedicamentoDto: CreateMedicamentoDto) {
    return this.medicamentosService.create(createMedicamentoDto);
  }

  @Get()
  findAll() {
    return this.medicamentosService.findAll();
  }

  @Get(':prontuario')
  findOne(@Param('prontuario') prontuario: number) {
    return this.medicamentosService.findOne(prontuario);
  }

  @Patch(':prontuario')
  update(@Param('prontuario') prontuario: number, @Body() updateMedicamentoDto: UpdateMedicamentoDto) {
    return this.medicamentosService.update(prontuario, updateMedicamentoDto);
  }

  @Delete(':prontuario')
  remove(@Param('prontuario') prontuario: number) {
    return this.medicamentosService.remove(prontuario);
  }
}
