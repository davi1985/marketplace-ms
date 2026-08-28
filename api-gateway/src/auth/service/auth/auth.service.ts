import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { serviceConfig } from 'src/config/gateway.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  validateJwtToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('invalid jwt token');
    }
  }

  async validateSessionToken(sessionToken: string): Promise<UserSession> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<UserSession>(
          `${serviceConfig.users.url}/sessions/validate/${sessionToken}`,
          { timeout: serviceConfig.users.timeout },
        ),
      );

      return data;
    } catch {
      throw new UnauthorizedException('invalid jwt token');
    }
  }

  async login(loginDto: LoginDTO): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<unknown>(
          `${serviceConfig.users.url}/login`,
          loginDto,
          {
            timeout: serviceConfig.users.timeout,
          },
        ),
      );

      return data;
    } catch {
      throw new UnauthorizedException('invalid login credentials');
    }
  }

  async register(registerDto: RegisterDTO) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<unknown>(
          `${serviceConfig.users.url}/auth/register`,
          registerDto,
          {
            timeout: serviceConfig.users.timeout,
          },
        ),
      );

      return data;
    } catch {
      throw new UnauthorizedException('registration failed');
    }
  }
}

type UserSession = {
  valid: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  } | null;
};

type LoginDTO = {
  email: string;
  password: string;
};

type RegisterDTO = {
  name: string;
  email: string;
  password: string;
};
