import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';
import { IUser } from '../interfaces/user.interface';
export interface AuthRequest extends Request {
    user: IUser;
}

export const CurrentUser = createParamDecorator(
    (_: unknown, context: ExecutionContext): IUser => {
        const request = context.switchToHttp().getRequest<AuthRequest>();

        return request.user;
    },
);