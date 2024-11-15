import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFornecedoreDto } from './dto/create-fornecedore.dto';
import { UpdateFornecedoreDto } from './dto/update-fornecedore.dto';
import { Fornecedores } from './entities/fornecedores.entity';

@Injectable()
export class FornecedoresService {
  constructor(
    @InjectRepository(Fornecedores)
    private fornecedoresRepository: Repository<Fornecedores>
  ) { }
  async create(createFornecedoreDto: CreateFornecedoreDto) {
    // const isFornecedores = await this.fornecedoresRepository.findOne({ where: { cnpj: createFornecedoreDto.cnpj } });
    // if (!isFornecedores) throw new NotAcceptableException(`CNPJ ${isFornecedores} já cadastrado.`);

    // if (isFornecedores) {
    //   try {
    //     await this.fornecedoresRepository.save({
    //       nome: createFornecedoreDto.nome,
    //       cnpj: createFornecedoreDto.cnpj,
    //       email: createFornecedoreDto.email,
    //       contato: createFornecedoreDto.contato
    //     })
    //   } catch {

    //   }
    // }

    // return isFornecedores;
    // return 'Criado com sucesso';
  }

  findAll() {
    return `This action returns all fornecedores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fornecedore`;
  }

  update(id: number, updateFornecedoreDto: UpdateFornecedoreDto) {
    return `This action updates a #${id} fornecedore`;
  }

  remove(id: number) {
    return `This action removes a #${id} fornecedore`;
  }
}
