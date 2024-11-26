import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { VivamedJwtService } from '../vivamed-jwt-module/jwt.service';
import { UserV2JwtPayload } from './interfaces/user-v2-jwt.interface';

@Injectable()
export class AuthV2Guard implements CanActivate {

    private readonly accessTokenSecret = process.env.JWT_SECRET_KEY;

    constructor(private vivamedJwtService: VivamedJwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
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

            request['user'] = payload;

            return true;
        } catch (error) {
            throw error;
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}