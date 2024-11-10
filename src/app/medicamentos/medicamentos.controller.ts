import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';
import { MedicamentosService } from './medicamentos.service';

@Controller('medicamentos')
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) { }

  @Post()
  create(@Body() createMedicamentoDto: CreateMedicamentoDto[]) {
    return this.medicamentosService.create(createMedicamentoDto);
  }

  // @Post('create-multiple')
  // async createMultiple(@Body() createMedicamentoDto: CreateMedicamentoDto[]) {
  //   return await this.medicamentosService.createMultipleMedicamentos(createMedicamentoDto);
  // }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicamentosService.remove(id);
  }

  @Delete('/deletemany/:ids')
  removeMany(@Param('ids') ids: string) {
    // Divide a string de IDs em um array, considerando que os IDs estão separados por vírgulas
    const idArray = ids.split(',');
    return this.medicamentosService.removeMany(idArray);
  }
}
