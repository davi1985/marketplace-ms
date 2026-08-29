import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { LoginRequestDto } from 'src/auth/dtos/login.dto';
import { RegisterRequestDto } from 'src/auth/dtos/register.dto';
import { serviceConfig } from 'src/config/gateway.config';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
};

type UserSession = {
  valid: boolean;
  user: User | null;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  validateJwtToken(token: string): AuthResponse {
    try {
      return this.jwtService.verify<AuthResponse>(token);
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

  async login(loginDto: LoginRequestDto): Promise<AuthResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<AuthResponse>(
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

  async register(registerDto: RegisterRequestDto): Promise<AuthResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<AuthResponse>(
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
