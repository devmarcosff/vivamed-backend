import {
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { VivamedJwtService } from 'src/app/vivamed-jwt-module/jwt.service';
import { UserV2JwtPayload } from './interfaces/user-v2-jwt.interface';

@Injectable()
export class AuthV2Guard {

    private readonly accessTokenSecret = process.env.JWT_SECRET_KEY;
    private readonly accessTokenExpiration = process.env.JWT_ACCESS_EXPIRATION || '15m';
    private readonly refreshTokenSecret = process.env.JWT_REFRESH_SECRET_KEY;
    private readonly refreshTokenExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d';

    constructor(private vivamedJwtService: VivamedJwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token não fornecido');
        }

        try {
            const isExpired = await this.vivamedJwtService.verifyAccessTokenExpires<UserV2JwtPayload>(token, this.accessTokenSecret);

            if (isExpired) {
                throw new UnauthorizedException('Token inválido');
            }

            request['user'] = this.vivamedJwtService.decode<UserV2JwtPayload>(token, this.accessTokenSecret);

            return true;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Token inválido');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}