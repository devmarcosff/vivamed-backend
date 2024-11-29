import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { UserV2 } from '../user/entities/user-v2.entity';
import { VivamedJwtService } from '../vivamed-jwt-module/jwt.service';
import { AuthV2Dto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestResetPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { UserV2JwtPayload } from './interfaces/user-v2-jwt.interface';

@Injectable()
export class AuthV2Service {

    private readonly accessTokenSecret = process.env.JWT_SECRET_KEY;
    private readonly accessTokenExpiration = process.env.JWT_ACCESS_EXPIRATION || '15m';
    private readonly refreshTokenSecret = process.env.JWT_REFRESH_SECRET_KEY;
    private readonly refreshTokenExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d';

    constructor(
        @InjectRepository(UserV2)
        private userRepository: Repository<UserV2>,
        private mailerService: MailerService,
        private readonly vivamedJwtService: VivamedJwtService,
    ) { }

    async signIn(createAuthDto: AuthV2Dto) {
        const { username } = createAuthDto;
        try {
            const userDB = await this.userRepository.findOne({
                where: [
                    { cpf: username },
                    { email: username },
                    { enabled: true }
                ],
            });
            if (!userDB) throw new BadRequestException(`Usuário não encontrado.`);

            const validPass = await bcrypt.compare(createAuthDto.password, userDB.password);
            if (!validPass) throw new BadRequestException(`Senha incorreta.`);


            if (userDB.accessToken) {
                try {
                    const isExpired = await this.vivamedJwtService.verifyTokenExpires(userDB.accessToken, this.accessTokenSecret);

                    if (!isExpired) {
                        return {
                            access_token: userDB.accessToken
                        };
                    }
                } catch (tokenError) {
                }
            }

            return await this.getTokens(userDB);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException(`Erro ao entrar com o usuário.`);
        }
    }

    private async getTokens(user: UserV2) {
        const payload = { sub: user.id, ...user.toDto() };

        const [access_token, refresh_token] = await Promise.all([
            this.vivamedJwtService.encode(payload, this.accessTokenSecret, this.accessTokenExpiration),
            this.vivamedJwtService.encode(payload, this.refreshTokenSecret, this.refreshTokenExpiration),
        ]);

        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
        await this.userRepository.update(user.id, {
            accessToken: access_token,
            refreshToken: hashedRefreshToken,
        });

        return {
            access_token: access_token,
            refresh_token: refresh_token
        };
    }

    async refresh(dto: RefreshTokenDto) {
        try {
            const payload = this.vivamedJwtService.decode<UserV2JwtPayload>(dto.access_token);
            const userDB = await this.userRepository.findOne({ where: { id: payload.sub, enabled: true } });
            if (!userDB || !userDB.refreshToken) {
                throw new UnauthorizedException('Usuário não encontrado.');
            }

            const refreshTokenMatches = await bcrypt.compare(dto.refresh_token, userDB.refreshToken);
            if (!refreshTokenMatches) {
                throw new UnauthorizedException('Acesso negado.');
            }

            const isExpired = await this.vivamedJwtService.verifyTokenExpires(dto.refresh_token, this.refreshTokenSecret);
            if (isExpired) {
                throw new UnauthorizedException('Token expirado, realize o login novamente.');
            }

            return await this.getTokens(userDB);
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException(error);
            // throw new UnauthorizedException('Erro ao renovar o token');
        }
    }

    async logout(userId: string) {
        await this.userRepository.update(userId, { accessToken: null, refreshToken: null });
        return { message: 'Logout realizado com sucesso' };
    }


    async requestPasswordReset(dto: RequestResetPasswordDto): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { cpf: dto.cpf, email: dto.email, enabled: true }
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const resetCode = randomBytes(3).toString('hex').toUpperCase();
        const expirationDate = new Date();
        expirationDate.setMinutes(5);

        user.codeResetPassword = resetCode;
        user.codeResetPasswordExpiration = expirationDate;
        await this.userRepository.save(user);

        const payload = { email: user.email, code: resetCode };
        const token = await this.vivamedJwtService.encode(payload, this.accessTokenSecret, "5m");
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Código de redefinição de senha',
            template: 'reset-password',
            context: {
                code: resetCode,
                name: user.profile?.name || user.email,
                resetLink: resetLink,
            },
        });
    }

    async resetPassword(dto: ResetPasswordDto): Promise<void> {
        const user = await this.userRepository.findOne({
            where: {
                cpf: dto.cpf,
                email: dto.email
            }
        });

        if (!user) {
            throw new BadRequestException('Usuário não encontrado');
        }

        if (!user.codeResetPasswordExpiration || new Date() > user.codeResetPasswordExpiration) {
            throw new BadRequestException('O código de redefinição expirou');
        }

        if (!user.codeResetPassword || user.codeResetPassword !== dto.code) {
            throw new BadRequestException('Código de redefinição inválido');
        }

        user.password = await bcrypt.hash(dto.newPassword, 10);
        user.codeResetPassword = null;
        user.codeResetPasswordExpiration = null;
        await this.userRepository.save(user);
    }
}
