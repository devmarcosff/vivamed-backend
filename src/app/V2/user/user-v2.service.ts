import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Pagination } from 'src/shared/types/pagination.type';
import { ILike, Repository } from 'typeorm';
import { ProfileV2 } from '../profile/entities/profile-v2.entity';
import { CreateUserV2Dto } from './dto/create-user-v2.dto';
import { UserV2FilterDto } from './dto/filter-user-v2.dto';
import { UserV2Dto } from './dto/user-v2.dto';
import { UserV2 } from './entities/user-v2.entity';

@Injectable()
export class UserV2Service {
    constructor(
        @InjectRepository(UserV2)
        private userRepository: Repository<UserV2>,
        @InjectRepository(ProfileV2)
        private profileRepository: Repository<ProfileV2>,
    ) { }

    async create(createUserV2Dto: CreateUserV2Dto): Promise<UserV2> {
        try {
            let eCpf = await this.userRepository.existsBy({ cpf: createUserV2Dto.cpf });
            if (eCpf) throw new BadRequestException('CPF já está em uso.');

            let eEmail = await this.userRepository.existsBy({ email: createUserV2Dto.email });
            if (eEmail) throw new BadRequestException('E-mail já cadastrado, escolha um e-mail de usuário diferente.');

            const hashedPassword = await bcrypt.hash(createUserV2Dto.password, 10);

            const newUser = {
                cpf: createUserV2Dto.cpf,
                email: createUserV2Dto.email,
                role: createUserV2Dto.role
            } as UserV2;

            const user = this.userRepository.create({
                ...newUser,
                password: hashedPassword
            });

            let userDb;
            try {
                userDb = await this.userRepository.save(user);
            } catch (error) {
                throw new BadRequestException('Erro ao salvar usuário no banco de dados.');
            }

            //#region Profile
            try {
                let newProfile = {
                    name: createUserV2Dto.nome,
                    user: userDb
                } as ProfileV2;
                await this.profileRepository.save(newProfile);
            } catch (error) {
                throw new BadRequestException('Erro ao salvar o perfil do usuário no banco de dados.');
            }
            //#endregion

            return userDb;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Erro interno ao criar o usuário.');
        }
    }


    async findAll(filter: UserV2FilterDto): Promise<Pagination<UserV2Dto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        if (filter.name) {
            where.profile = { name: ILike(`%${filter.name}%`) };
        }
        if (filter.email) {
            where.email = ILike(`%${filter.email}%`);
        }
        if (filter.cpf) {
            where.cpf = ILike(`%${filter.cpf}%`);
        }

        const [items, total] = await this.userRepository.findAndCount({
            relations: { profile: { address: true } },
            where,
            take: limit,
            skip: skip,
            order: {
                createdAt: 'ASC'
            }
        });

        const userDtos = items.map(user => user.toDto());

        return {
            items: userDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async findOne(id: string): Promise<UserV2> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['profile', 'profile.address']
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }
}
