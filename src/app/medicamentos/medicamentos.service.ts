import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { Consulta } from '../consulta/entities/consulta.entity';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';
import { Medicamento } from './entities/medicamento.entity';

@Injectable()
export class MedicamentosService {
  constructor(
    @InjectRepository(Medicamento)
    private medicamentoRepository: Repository<Medicamento>,
    @InjectRepository(Consulta)
    private consultaRepository: Repository<Consulta>,
    @InjectRepository(Cidadao)
    private cidadaoRepository: Repository<Cidadao>
  ) { }

  async create(createMedicamentoDto: CreateMedicamentoDto) {

    const id = await this.consultaRepository.findOne({ where: { id: createMedicamentoDto.cidadao } });

    if (!id) {
      throw new Error('Consulta não indentificada.');
    }

    await this.medicamentoRepository.save({
      prescricao: createMedicamentoDto.prescricao,
      cidadao: createMedicamentoDto.cidadao,
      quantidade: createMedicamentoDto.quantidade,
      consultas: id
    })

    return "Medicamento adicionado com sucesso.";
  }

  async findAll() {
    const medicamentos = await this.medicamentoRepository.find()

    return medicamentos;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicamento`;
  }

  update(id: number, updateMedicamentoDto: UpdateMedicamentoDto) {
    return `This action updates a #${id} medicamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicamento`;
  }
}
