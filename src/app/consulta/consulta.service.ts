import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { Consulta } from './entities/consulta.entity';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta)
    private consultaRepository: Repository<Consulta>,
    @InjectRepository(Cidadao)
    private cidadaoRepository: Repository<Cidadao>
  ) { }

  async create(createConsultaDto: CreateConsultaDto) {

    const prontuario = await this.cidadaoRepository.findOne({ where: { prontuario: createConsultaDto.prontuario } });

    if (!prontuario) {
      throw new Error('Paciente não encontrado');
    }

    await this.consultaRepository.save({
      createAt: new Date(),
      descricao: createConsultaDto.descricao,
      prontuario: createConsultaDto.prontuario,
      paciente: `${prontuario.name}`,
      respTec: createConsultaDto.respTec,
      role: createConsultaDto.role,
      cidadao: prontuario
    })

    return 'Consulta cadastrada com sucesso.';
  }

  async findAll() {
    const consulta = await this.consultaRepository.find({ relations: { medicamentos: true } })
    return consulta;
  }

  async findOne(id: string) {
    const consulta = await this.consultaRepository.findOne({ where: { id: id }, relations: { medicamentos: true } })
    if (!consulta) throw new NotFoundException(`Consulta não encontrada.`)
    return consulta;
  }

  // async findBy(prontuario: string) {
  //   const consulta = await this.consultaRepository.findBy({ prontuario })
  //   if (!consulta) throw new NotFoundException(`Consulta não encontrada.`)
  //   return consulta;
  // }

  async update(prontuario: string, updateConsultaDto: UpdateConsultaDto) {
    const consulta = await this.consultaRepository.findOne({ where: { prontuario: prontuario } })
    if (!consulta) throw new NotFoundException(`Consulta não encontrada.`)
    return consulta;
  }

  async remove(prontuario: string) {
    const consultas = await this.consultaRepository.findOne({ where: { prontuario: prontuario } });
    if (!consultas) throw new NotFoundException(`Consulta não foi identificada.`)

    this.consultaRepository.delete({ prontuario });

    return `Consulta deletada com sucesso.`
  }
}
