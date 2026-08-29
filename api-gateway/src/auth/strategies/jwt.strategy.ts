import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService, JwtTokenPayload } from '../service/auth/auth.service';

type JwtPayload = JwtTokenPayload;

type AuthenticatedUser = {
  userId: string;
  email: string;
  role: string;
  token: string;
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

  validate(payload: JwtPayload): AuthenticatedUser {
    if (!payload) throw new UnauthorizedException();

    const user = this.authService.validateJwtToken(payload.token);

    if (!user) throw new UnauthorizedException();

    return {
      ...user,
      userId: user.sub,
      email: user.email,
      role: user.role,
    };
  }
}
