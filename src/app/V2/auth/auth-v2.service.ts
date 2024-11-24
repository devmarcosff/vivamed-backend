import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { VivamedJwtService } from 'src/app/vivamed-jwt-module/jwt.service';
import { Repository } from 'typeorm';
import { UserV2 } from '../user/entities/user-v2.entity';
import { AuthV2Dto } from './dto/auth.dto';
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
                ],
            });
            if (!userDB) throw new BadRequestException(`Usuário não encontrado.`);

            const validPass = await bcrypt.compare(createAuthDto.password, userDB.password);
            if (!validPass) throw new BadRequestException(`Senha incorreta.`);


            if (userDB.accessToken) {
                try {
                    const isExpired = await this.verifyAccessTokenExpires(userDB.accessToken);

                    if (!isExpired) {
                        return {
                            access_token: userDB.accessToken,
                            refresh_token: userDB.refreshToken
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
            access_token: user.accessToken,
            refresh_token: hashedRefreshToken
        };
    }

    async refresh(userId: string, refreshToken: string) {
        try {
            const userDB = await this.userRepository.findOne({ where: { id: userId } });
            if (!userDB || !userDB.refreshToken) {
                throw new UnauthorizedException('Acesso negado');
            }

            const refreshTokenMatches = await bcrypt.compare(
                refreshToken,
                userDB.refreshToken
            );

            if (!refreshTokenMatches) {
                throw new UnauthorizedException('Acesso negado');
            }

            return await this.getTokens(userDB);
        } catch (error) {
            throw new UnauthorizedException('Erro ao renovar o token');
        }
    }

    async logout(userId: string) {
        await this.userRepository.update(userId, { accessToken: null, refreshToken: null });
        return { message: 'Logout realizado com sucesso' };
    }


    async requestPasswordReset(dto: RequestResetPasswordDto): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { cpf: dto.cpf, email: dto.email }
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

    async verifyAccessTokenExpires(token: string): Promise<boolean> {
        try {
            const payload = await this.vivamedJwtService.decode<UserV2JwtPayload>(token, this.accessTokenSecret);

            const currentTimestamp = Math.floor(Date.now() / 1000);

            if (payload.exp && payload.exp < currentTimestamp) {
                return true; //Token expirado
            }

            if (payload.iat && payload.iat > currentTimestamp) {
                return true; //Token inválido: data de emissão futura
            }

            return false;
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }
}
