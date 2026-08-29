import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../service/auth/auth.service';

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  token: string;
  iat?: number;
  exp?: number;
};

type JwtRequest = {
  headers?: {
    authorization?: string;
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy as any) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req: JwtRequest | undefined) => {
        const authHeader = req?.headers?.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

        return authHeader.replace('Bearer ', '');
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? '',
    });
  }

  validate(payload: JwtPayload) {
    if (!payload) throw new UnauthorizedException();

    const user = this.authService.validateJwtToken(payload.token);

    if (!user) throw new UnauthorizedException();

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
