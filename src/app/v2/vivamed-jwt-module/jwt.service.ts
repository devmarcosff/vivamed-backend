import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/shared/interfaces/jwt.interface';

@Injectable()
export class VivamedJwtService {
    constructor(private readonly jwtService: NestJwtService) { }

    async encode<T extends object>(payload: T, secret: string, expiresIn: string): Promise<string> {
        return this.jwtService.signAsync(payload, { secret, expiresIn });
    }

    decode<T extends object = any>(token: string): T | null {
        return this.jwtService.decode(token) as T | null;
    }

    async verify<T extends object = any>(token: string, secret: string): Promise<T> {
        return this.jwtService.verifyAsync<T>(token, { secret });
    }

    async verifyTokenExpires<T extends JwtPayload>(token: string, secret: string): Promise<boolean> {
        try {
            const payload = await this.verify<T>(token, secret);

            const currentTimestamp = Math.floor(Date.now() / 1000);

            if (payload.exp && payload.exp < currentTimestamp) {
                return true; // Expired token
            }

            if (payload.iat && payload.iat > currentTimestamp) {
                return true; // Invalid token: future issue date
            }

            return false;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired.');
            }
            throw new UnauthorizedException('Invalid token.');
        }
    }
}
