import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { CreateAuthCidadaoDto } from './dto/create-auth-cidadao.dto';

@Injectable()
export class AuthCidadaoService {
  constructor(
    @InjectRepository(Cidadao)
    private cidadaoRepository: Repository<Cidadao>,
    private jwtService: JwtService
  ) { }

  async create(createAuthCidadaoDto: CreateAuthCidadaoDto) {
    const { prontuario } = createAuthCidadaoDto
    try {
      const userDB = await this.cidadaoRepository.findOne({ where: { prontuario }, relations: { consultas: true } });
      const validPass = await bcrypt.compare(createAuthCidadaoDto.password, userDB.password)
      if (!validPass) throw new NotFoundException(`Usuário ou senha incorretos`);

      delete userDB.password

      const payload = { sub: userDB.id, ...userDB };
      return {
        access_token: await this.jwtService.signAsync(payload),
      }
    } catch (error) {
      throw new NotFoundException(`Usuário ou senha incorretos`);
    }
  }
}
