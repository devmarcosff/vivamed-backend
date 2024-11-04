import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { CreateAgendarConsultaDto } from './dto/create-agendar-consulta.dto';
import { UpdateAgendarConsultaDto } from './dto/update-agendar-consulta.dto';
import { AgendarConsulta } from './entities/agendar-consulta.entity';

@Injectable()
export class AgendarConsultaService {
  constructor(
    @InjectRepository(AgendarConsulta)
    private angedarConsultaRepository: Repository<AgendarConsulta>,
    @InjectRepository(Cidadao)
    private cidadaoRepository: Repository<Cidadao>
  ) { }

  async create(createAgendarConsultaDto: CreateAgendarConsultaDto) {
    const prontuario = await this.cidadaoRepository.findOne({ where: { prontuario: createAgendarConsultaDto.prontuario }, relations: { agendaConsultas: true } });
    const ishoraConsulta = await this.angedarConsultaRepository.findOne({ where: { horaconsulta: createAgendarConsultaDto.horaconsulta } });
    if (!prontuario) throw new NotFoundException('Paciente não encontrado');
    if (ishoraConsulta) throw new NotFoundException('Já existe uma consulta agendada para este horario.');

    const agendarConsulta = {
      createAt: new Date,
      prontuario: createAgendarConsultaDto.prontuario,
      dataconsulta: createAgendarConsultaDto.dataconsulta,
      horaconsulta: createAgendarConsultaDto.horaconsulta,
      recorrente: createAgendarConsultaDto.recorrente,
      cidadao: prontuario
    } as AgendarConsulta

    await this.angedarConsultaRepository.save(agendarConsulta);

    return `Consulta agendada com sucesso. Data: ${createAgendarConsultaDto.dataconsulta} as ${createAgendarConsultaDto.horaconsulta}`;
  }

  async findAll() {
    const isAgendaConsulta = await this.angedarConsultaRepository.find();

    return isAgendaConsulta
  }

  async findByProntuario(id: string) {
    const isCidadoes = await this.angedarConsultaRepository.findOne({ where: { prontuario: id } });

    if (!isCidadoes) throw new NotFoundException(`Prontuário ${id} não encontrado.`)

    return isCidadoes;
  }

  update(id: number, updateAgendarConsultaDto: UpdateAgendarConsultaDto) {
    return `This action updates a #${id} agendarConsulta`;
  }

  remove(id: number) {
    return `This action removes a #${id} agendarConsulta`;
  }
}
