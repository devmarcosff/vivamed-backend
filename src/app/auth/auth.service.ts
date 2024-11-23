import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/app/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async signIn(createAuthDto: CreateAuthDto) {
        const { username } = createAuthDto
        try {
            const userDB = await this.userRepository.findOne({ where: { username } });
            const validPass = await bcrypt.compare(createAuthDto.password, userDB.password);
            if (!validPass) throw new BadRequestException(`Usuário ou senha incorretos`);

            delete userDB.password;

            const payload = { sub: userDB.id, ...userDB };
            return {
                access_token: await this.jwtService.signAsync(payload),
            }
        } catch (error) {
            throw new BadRequestException(`Usuário ou senha incorretos`);
        }
    }
}
