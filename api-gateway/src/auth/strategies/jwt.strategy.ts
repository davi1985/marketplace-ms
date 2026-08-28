import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../service/auth/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  token: string;
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload) throw new UnauthorizedException();

    const user = await this.authService.validateJwtToken(payload.token);

    if (!user) throw new UnauthorizedException();

    return {
      ...user,
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
