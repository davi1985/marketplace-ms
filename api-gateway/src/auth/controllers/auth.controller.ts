import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
        },
        password: {
          type: 'string',
          example: 'Password123!',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Davi Silva',
        },
        email: {
          type: 'string',
          example: 'davi@example.com',
        },
        password: {
          type: 'string',
          example: 'Password123!',
        },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }
}
