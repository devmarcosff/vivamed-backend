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

    async signIn({ username, password }: AuthV2Dto) {
        const userDB = await this.userRepository.findOne({
            where: [
                { cpf: username, enabled: true },
                { email: username, enabled: true }
            ],
        });
        if (!userDB) throw new BadRequestException('User not found.');

        const validPass = await bcrypt.compare(password, userDB.password);
        if (!validPass) throw new BadRequestException('Incorrect password.');

        if (userDB.accessToken) {
            try {
                const isExpired = await this.vivamedJwtService.verifyTokenExpires(userDB.accessToken, this.accessTokenSecret);

                if (!isExpired) {
                    return {
                        access_token: userDB.accessToken
                    };
                }
            } catch (tokenError) { }
        }

        return await this.getTokens(userDB);
    }

    private async getTokens(user: UserV2, keepRefreshToken = false) {
        const payload = { sub: user.id, ...user.toDto() };

        const [access_token, refresh_token] = await Promise.all([
            this.vivamedJwtService.encode(payload, this.accessTokenSecret, this.accessTokenExpiration),
            this.vivamedJwtService.encode(payload, this.refreshTokenSecret, this.refreshTokenExpiration),
        ]);

        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
        await this.userRepository.update(user.id, {
            accessToken: access_token,
            refreshToken: keepRefreshToken ? user.refreshToken : hashedRefreshToken,
        });

        return {
            access_token: access_token,
            refresh_token: keepRefreshToken ? undefined : refresh_token
        };
    }

    async refresh(dto: RefreshTokenDto) {
        try {
            const payload = this.vivamedJwtService.decode<UserV2JwtPayload>(dto.access_token);
            const userDB = await this.userRepository.findOne({ where: { id: payload.sub, enabled: true } });
            if (!userDB || !userDB.refreshToken) {
                throw new UnauthorizedException('User not found.');
            }

            const refreshTokenMatches = await bcrypt.compare(dto.refresh_token, userDB.refreshToken);
            if (!refreshTokenMatches) {
                throw new UnauthorizedException('Access denied.');
            }

            const isExpired = await this.vivamedJwtService.verifyTokenExpires(dto.refresh_token, this.refreshTokenSecret);
            if (isExpired) {
                throw new UnauthorizedException('Token expired, please log in again.');
            }

            if (userDB.accessToken) {
                const isExpired = await this.vivamedJwtService.verifyTokenExpires(userDB.accessToken, this.accessTokenSecret);
                if (!isExpired) {
                    return {
                        access_token: userDB.accessToken
                    };
                }
            }

            return await this.getTokens(userDB, true);
        } catch (error) {
            throw new UnauthorizedException('Error renewing token.');
        }
    }

    async logout(userId: string) {
        const userDB = await this.userRepository.findOneBy({ id: userId });

        if (userDB && (!userDB.accessToken || userDB.accessToken === '')) {
            return { message: 'User is already logged out.' };
        }
        await this.userRepository.update(userId, { accessToken: null, refreshToken: null });
        return { message: 'Logout successful.' };
    }

    async requestPasswordReset(dto: RequestResetPasswordDto): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { cpf: dto.cpf, email: dto.email, enabled: true }
        });

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const resetCode = randomBytes(3).toString('hex').toUpperCase();
        const expirationDate = new Date();
        expirationDate.setMinutes(5);

        user.codeResetPassword = resetCode;
        user.codeResetPasswordExpiration = expirationDate;
        await this.userRepository.save(user);

        const payload = { email: user.email, code: resetCode };
        const token = await this.vivamedJwtService.encode(payload, this.accessTokenSecret, '5m');
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Password Reset Code',
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
            throw new BadRequestException('User not found.');
        }

        if (!user.codeResetPasswordExpiration || new Date() > user.codeResetPasswordExpiration) {
            throw new BadRequestException('Reset code expired.');
        }

        if (!user.codeResetPassword || user.codeResetPassword !== dto.code) {
            throw new BadRequestException('Invalid reset code.');
        }

        user.password = await bcrypt.hash(dto.newPassword, 10);
        user.codeResetPassword = null;
        user.codeResetPasswordExpiration = null;
        await this.userRepository.save(user);
    }
}
