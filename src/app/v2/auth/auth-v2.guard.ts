import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { UserV2 } from '../user/entities/user-v2.entity';
import { VivamedJwtService } from '../vivamed-jwt-module/jwt.service';
import { UserV2JwtPayload } from './interfaces/user-v2-jwt.interface';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthV2Guard implements CanActivate {

    private readonly accessTokenSecret = process.env.JWT_SECRET_KEY;

    constructor(
        private readonly vivamedJwtService: VivamedJwtService,
        private readonly reflector: Reflector,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token não fornecido');
        }

        try {
            const isExpired = await this.vivamedJwtService.verifyTokenExpires<UserV2JwtPayload>(token, this.accessTokenSecret);

            if (isExpired) {
                throw new UnauthorizedException('Token inválido');
            }
            const payload = await this.vivamedJwtService.decode<UserV2JwtPayload>(token);

            await this.dataSource.transaction(async (manager) => {
                const userRepository = manager.getRepository(UserV2);
                const user = await userRepository.findOneBy({ id: payload.sub, enabled: true });
                if (!user) {
                    throw new UnauthorizedException('Usuário não encontrado');
                }

                if (!user.accessToken) {
                    throw new UnauthorizedException('Usuário não está logado, faça o login novamente');
                }
            });

            request['user'] = payload;

            return true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expirado');
            }
            throw error;
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}