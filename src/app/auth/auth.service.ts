import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/app/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Cidadao } from '../cidadao/entities/cidadao.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cidadao)
    private cidadaoRepository: Repository<Cidadao>,
    private jwtService: JwtService
  ) { }

  async signIn(createAuthDto: CreateAuthDto) {
    const { username } = createAuthDto
    try {
      const userDB = await this.userRepository.findOne({ where: { username }, relations: { orders: true, address: true } });
      const validPass = await bcrypt.compare(createAuthDto.password, userDB.password)
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
