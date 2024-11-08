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
    if (eCpf) throw new NotFoundException('CPF já está em uso.')
    if (eUsername) throw new NotFoundException('Nome de usuário já cadastrado, escolha um nome de usuário diferente.')

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const novoUser = {
      name: createUserDto.name,
      cpf: createUserDto.cpf,
      birthday: createUserDto.birthday,
      active: new Date,
      role: createUserDto.role,
      idProf: createUserDto.idProf,
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

  async findById(id: string) {
    const eUserById = await this.userRepository.findOne({ where: { id }, relations: { address: true } });

    if (!eUserById) throw new NotFoundException(`O usuário com o id ${id} não foi identificado`)

    const { password, ...result } = eUserById;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const eUserByCpf = await this.userRepository.findOne({ where: { id } });
    if (!eUserByCpf) throw new NotFoundException(`O usuário com o id ${id} não foi identificado`)
    this.userRepository.update(eUserByCpf.id, updateUserDto);

    return `Usuário atualizado com sucesso`
  }

  async updateActive(username: string) {
    const eUserById = await this.userRepository.findOne({ where: { username } });
    if (!eUserById) throw new NotFoundException(`O usuário ${username} não foi identificado`)
    this.userRepository.update(eUserById.id, {
      active: new Date
    });

    return `Usuário atualizado com sucesso`
  }

  async remove(cpf: string) {
    const userByCpf = await this.userRepository.findOne({ where: { cpf } });

    if (!userByCpf) throw new NotFoundException(`O usuário com o cpf ${cpf} não foi identificado`)

    await this.userRepository.delete({ cpf });

    return `Usuário com o cpf ${cpf} foi excluído com sucesso`;
  }
}
