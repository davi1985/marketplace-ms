import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { LoginRequestDto } from '../dtos/login.dto';
import { RegisterRequestDto } from '../dtos/register.dto';
import { AuthService } from '../service/auth/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate user',
    description:
      'Validates email and password and returns the user profile plus access/session tokens.',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          description: 'Authenticated user information',
          example: {
            id: 'uuid',
            email: 'user@email.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            status: 'active',
          },
        },
        accessToken: {
          type: 'string',
          description: 'JWT access token used for authenticated requests.',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          description: 'Refresh token to obtain a new access token.',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        sessionToken: {
          type: 'string',
          description: 'Session token used for session-based authentication.',
          example: 'sess_abc123',
        },
        expiresIn: {
          type: 'number',
          description: 'Token expiration time in seconds.',
          example: 86400,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: {
          type: 'string',
          example: 'invalid login credentials',
        },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Too many login attempts. Please wait before trying again.',
  })
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async login(@Body() loginDto: LoginRequestDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user account',
    description:
      'Registers a new marketplace user with the provided account information and role.',
  })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'uuid',
        },
        email: {
          type: 'string',
          example: 'user@email.com',
        },
        firstName: {
          type: 'string',
          example: 'John',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'The registration payload is invalid or incomplete.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['email must be an email address'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'The email is already registered in the system.',
  })
  @Throttle({ medium: { limit: 3, ttl: 60000 } })
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    return this.authService.register(registerRequestDto);
  }
}
