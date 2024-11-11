import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgendarConsulta } from '../agendar-consulta/entities/agendar-consulta.entity';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { User } from '../user/entities/user.entity';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { Consulta } from './entities/consulta.entity';

@Injectable()
export class ConsultaService {
  constructor(
    @InjectRepository(Consulta)
    private consultaRepository: Repository<Consulta>,
    @InjectRepository(Cidadao)
    private cidadaoRepository: Repository<Cidadao>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AgendarConsulta)
    private angedarConsultaRepository: Repository<AgendarConsulta>
  ) { }

  async create(createConsultaDto: CreateConsultaDto) {
    const prontuario = await this.cidadaoRepository.findOne({ where: { prontuario: createConsultaDto.prontuario } });
    const idRespTec = await this.consultaRepository.findOne({ where: { respTec: createConsultaDto.idRespTec } });
    const tecResponsavel = await this.userRepository.findOne({ where: { id: createConsultaDto.idRespTec } });
    if (!prontuario) throw new NotFoundException('Paciente não encontrado');

    const agendamentoConsulta = await this.angedarConsultaRepository.findOne({ where: { prontuario: createConsultaDto.prontuario } })
    if (!agendamentoConsulta) throw new NotFoundException(`Agendamento de consulta não encontrada.`)
    const dataAtual = new Date();
    const dataAgendamentoFormatada = agendamentoConsulta.dataconsulta.toISOString().split('T')[0]
    const dataAtualFormatada = dataAtual.toISOString().split('T')[0]

    if (dataAgendamentoFormatada === dataAtualFormatada) {
      const createConsulta = await this.consultaRepository.save({
        createAt: new Date(),
        prontuario: createConsultaDto.prontuario,
        role: createConsultaDto.role,
        descricao: createConsultaDto.descricao,
        paciente: `${prontuario.nome}`,
        respTec: tecResponsavel.name,
        idRespTec: tecResponsavel.id,
        idConsulta: agendamentoConsulta.id,
        cidadao: prontuario
      })
      return createConsulta.id;
    } else {
      throw new NotFoundException('Nenhuma consulta agendada para esta data.');
    }
  }

  async findAll() {
    const consulta = await this.consultaRepository.find({ order: { createAt: 'DESC' }, relations: { medicamentos: true } })
    return consulta;
  }

  async findOne(id: string) {
    const consulta = await this.consultaRepository.findOne({ order: { createAt: 'DESC' }, where: { id: id }, relations: { medicamentos: true } })
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

  async remove(id: string) {
    const consultas = await this.consultaRepository.findOne({ where: { id: id } });
    if (!consultas) throw new NotFoundException(`Consulta não foi identificada.`)

    this.consultaRepository.delete({ id });

    return `Consulta deletada com sucesso.`
  }
}
