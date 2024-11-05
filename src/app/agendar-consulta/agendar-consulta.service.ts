import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { User } from '../user/entities/user.entity';
import { CreateAgendarConsultaDto } from './dto/create-agendar-consulta.dto';
import { UpdateAgendarConsultaDto } from './dto/update-agendar-consulta.dto';
import { AgendarConsulta } from './entities/agendar-consulta.entity';

@Injectable()
export class AgendarConsultaService {
  constructor(
    @InjectRepository(AgendarConsulta)
    private angedarConsultaRepository: Repository<AgendarConsulta>,
    @InjectRepository(Cidadao)
    private cidadaoRepository: Repository<Cidadao>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createAgendarConsultaDto: CreateAgendarConsultaDto) {
    const prontuario = await this.cidadaoRepository.findOne({ where: { prontuario: createAgendarConsultaDto.prontuario }, relations: { agendaConsultas: true } });
    const paciente = await this.cidadaoRepository.findOne({ where: { prontuario: createAgendarConsultaDto.prontuario } });
    const tecResponsavel = await this.userRepository.findOne({ where: { id: createAgendarConsultaDto.tecResponsavel } });
    const ishoraConsulta = await this.angedarConsultaRepository.findOne({ where: { horaconsulta: createAgendarConsultaDto.horaconsulta } });
    const isDataConsulta = await this.angedarConsultaRepository.findOne({ where: { dataconsulta: createAgendarConsultaDto.dataconsulta } });
    if (!prontuario) throw new NotFoundException('Paciente não encontrado');
    if (!tecResponsavel) throw new NotFoundException('Técnico não encontrado');
    if (isDataConsulta && ishoraConsulta) throw new NotFoundException('Já existe uma consulta agendada para esta data e horario.');

    const agendarConsulta = {
      createAt: new Date,
      prontuario: createAgendarConsultaDto.prontuario,
      paciente: paciente.nome,
      dataconsulta: createAgendarConsultaDto.dataconsulta,
      horaconsulta: createAgendarConsultaDto.horaconsulta,
      recorrente: createAgendarConsultaDto.recorrente,
      tecResponsavel: createAgendarConsultaDto.tecResponsavel,
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
