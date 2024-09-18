import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    let eCpf = await this.userRepository.existsBy({ cpf: createUserDto.cpf });
    let eUsername = await this.userRepository.existsBy({ username: createUserDto.username });
    if (eCpf) return 'CPF já está em uso.';
    if (eUsername) return 'Nome de usuário já cadastrado, escolha um nome de usuário diferente.';

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const novoUser = {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      cpf: createUserDto.cpf,
      birthday: createUserDto.birthday,
      username: createUserDto.username,
      password: hash,
    } as User

    await this.userRepository.save(novoUser);

    novoUser.password = undefined;
    return 'Usuário cadastrado com sucesso.';
  }

  async findAllUser() {
    const eUser = await this.userRepository.find({ relations: { address: true, orders: true } });

    return eUser.map(user => {
      const { password, ...result } = user;
      return result
    })
  }

  async findByCpf(cpf: string) {
    const eUserByCpf = await this.userRepository.findOne({ where: { cpf }, relations: { address: true } });

    if (!eUserByCpf) throw new NotFoundException(`O usuário com o cpf ${cpf} não foi identificado`)

    const { password, ...result } = eUserByCpf;
    return result;
  }

  async update(cpf: string, updateUserDto: UpdateUserDto) {
    const eUserByCpf = await this.userRepository.findOne({ where: { cpf } });

    if (!eUserByCpf) throw new NotFoundException(`O usuário com o cpf ${cpf} não foi identificado`)

    this.userRepository.update(eUserByCpf.id, updateUserDto);

    return `Usuário atualizado com sucesso`
  }

  async remove(cpf: string) {
    const userByCpf = await this.userRepository.findOne({ where: { cpf } });

    if (!userByCpf) throw new NotFoundException(`O usuário com o cpf ${cpf} não foi identificado`)

    await this.userRepository.delete({ cpf });

    return `Usuário com o cpf ${cpf} foi excluído com sucesso`;
  }
}
