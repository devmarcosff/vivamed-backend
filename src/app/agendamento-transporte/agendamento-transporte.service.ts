import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgendamentoTransporteDto } from './dto/create-agendamento-transporte.dto';
import { UpdateAgendamentoTransporteDto } from './dto/update-agendamento-transporte.dto';
import { AgendamentoTransporte } from './entities/agendamento-transporte.entity';

@Injectable()
export class AgendamentoTransporteService {
  constructor(
    @InjectRepository(AgendamentoTransporte)
    private agendamentoTransporteRepository: Repository<AgendamentoTransporte>
  ) { }

  async create(createAgendamentoTransporteDto: CreateAgendamentoTransporteDto) {

    await this.agendamentoTransporteRepository.save({
      createAt: new Date(),
      dataAgendada: createAgendamentoTransporteDto.dataAgendada,
      horaAgendada: createAgendamentoTransporteDto.horaAgendada,
      nomeMotorista: createAgendamentoTransporteDto.nomeMotorista,
      nomePaciente: createAgendamentoTransporteDto.nomePaciente,
      cpfPaciente: createAgendamentoTransporteDto.cpfPaciente,
      dataNascimento: createAgendamentoTransporteDto.dataNascimento
    });

    return 'Agendamento realizado com sucesso.'
  }

  async findAll() {
    const agendamentosTransporte = await this.agendamentoTransporteRepository.find()
    return agendamentosTransporte;
  }

  findOne(id: number) {
    return `This action returns a #${id} agendamentoTransporte`;
  }

  update(id: number, updateAgendamentoTransporteDto: UpdateAgendamentoTransporteDto) {
    return `This action updates a #${id} agendamentoTransporte`;
  }

  remove(id: number) {
    return `This action removes a #${id} agendamentoTransporte`;
  }
}
