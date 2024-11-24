import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/shared/interfaces/jwt.interface';

@Injectable()
export class VivamedJwtService {
    constructor(private readonly jwtService: NestJwtService) { }

    async encode<T extends object>(payload: T, secret: string, expiresIn: string): Promise<string> {
        return this.jwtService.signAsync(payload, { secret, expiresIn });
    }

    async decode<T extends object>(token: string, secret: string): Promise<T> {
        return this.jwtService.verifyAsync<T>(token, { secret });
    }

    async verifyAccessTokenExpires<T extends JwtPayload>(token: string, secret: string): Promise<boolean> {
        try {
            const payload = await this.decode<T>(token, secret);

            const currentTimestamp = Math.floor(Date.now() / 1000);

            if (payload.exp && payload.exp < currentTimestamp) {
                return true; //Token expirado
            }

            if (payload.iat && payload.iat > currentTimestamp) {
                return true; //Token inválido: data de emissão futura
            }

            return false;
        } catch (error) {
            return false;
        }
    }
}