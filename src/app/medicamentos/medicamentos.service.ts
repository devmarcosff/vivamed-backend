import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  // async create(createMedicamentoDto: CreateMedicamentoDto) {

  //   const id = await this.consultaRepository.findOne({ where: { id: createMedicamentoDto.consulta } });

  //   if (!id) {
  //     throw new Error('Consulta não indentificada.');
  //   }

  //   await this.medicamentoRepository.save({
  //     prescricao: createMedicamentoDto.prescricao,
  //     consulta: createMedicamentoDto.consulta,
  //     use: createMedicamentoDto.use,
  //     quantidade: createMedicamentoDto.quantidade,
  //     consultas: id
  //   })

  //   return "Medicamento adicionado com sucesso.";
  // }

  async create(createMedicamentoDto: CreateMedicamentoDto[]) {
    const ids = createMedicamentoDto.map((consulta) => consulta.consulta)
    const createById = await this.consultaRepository.findBy({ id: In(ids) })
    const foundIds = createById.map(med => med.id);

    const medicamentos = createMedicamentoDto.map(dto => this.medicamentoRepository.create({
      name: dto.name,
      manha: dto.manha,
      tarde: dto.tarde,
      noite: dto.noite,
      consulta: dto.consulta,
      consultas: foundIds[0]
    }));

    // Salva todos de uma vez
    await this.medicamentoRepository.save(medicamentos);

    return `${medicamentos.length > 1 ? `${medicamentos.length} medicamentos inseridos com sucesso` : `${medicamentos.length} medicamento inserido com sucesso`}`;
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

  async remove(id: string) {
    const medicamentoById = await this.medicamentoRepository.findOne({ where: { id } })
    if (!medicamentoById) throw new NotFoundException(`O medicamento com o id: ${id} não foi identificado`)
    await this.medicamentoRepository.delete({ id });

    return `Medicamento excluído com sucesso`;
  }

  async removeMany(ids: string[]) {
    const medicamentoById = await this.medicamentoRepository.findBy({ id: In(ids) })
    const foundIds = medicamentoById.map(med => med.id);
    const notFoundIds = ids.filter(id => !foundIds.includes(id));
    if (notFoundIds.length > 0) throw new NotFoundException(`Medicamentos com os seguintes IDs não foram encontrados: ${notFoundIds.join(', ')}`);
    await this.medicamentoRepository.delete(ids);

    // return `${medicamentoById.length} medicamentos excluídos com sucesso`;
    return `${medicamentoById.length > 1 ? `${medicamentoById.length} medicamentos excluídos com sucesso` : `${medicamentoById.length} medicamento excluído com sucesso`}`;
  }
}
