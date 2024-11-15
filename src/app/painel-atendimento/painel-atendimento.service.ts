import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePainelAtendimentoDto } from './dto/update-painel-atendimento.dto';
import { PainelAtendimento } from './entities/painel-atendimento.entity';

@Injectable()
export class PainelAtendimentoService {
  constructor(
    @InjectRepository(PainelAtendimento)
    private readonly painelAtendimentoRepository: Repository<PainelAtendimento>,
  ) { }

  async createTicket(): Promise<PainelAtendimento> {
    const senha = Math.floor(1000 + Math.random() * 9000).toString(); // Gera uma senha de 4 dígitos
    const createdAt = new Date(); // Pega a data e hora atual

    return await this.painelAtendimentoRepository.save({
      createdAt,
      senha
    });
  }

  async startAttendance(id: string, sala: string): Promise<PainelAtendimento> {
    const atendimento = await this.painelAtendimentoRepository.findOne({ where: { id } });
    if (atendimento) {
      atendimento.inicioAtendimento = new Date(); // Define a data de início do atendimento
      atendimento.sala = sala; // Atualiza a sala
      await this.painelAtendimentoRepository.save(atendimento);
    }
    return atendimento;
  }

  async finishAttendance(id: string): Promise<PainelAtendimento> {
    const atendimento = await this.painelAtendimentoRepository.findOne({ where: { id }, order: { finalAtendimento: 'ASC' } });
    if (atendimento) {
      atendimento.finalAtendimento = new Date();
      await this.painelAtendimentoRepository.save(atendimento);
    }
    return atendimento;
  }

  async getAllTickets(): Promise<PainelAtendimento[]> {
    return await this.painelAtendimentoRepository.find({
      // order: { createdAt: 'DESC' },
    });
  }

  findAll() {
    return `This action returns all painelAtendimento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} painelAtendimento`;
  }

  update(id: number, updatePainelAtendimentoDto: UpdatePainelAtendimentoDto) {
    return `This action updates a #${id} painelAtendimento`;
  }

  remove(id: number) {
    return `This action removes a #${id} painelAtendimento`;
  }
}
