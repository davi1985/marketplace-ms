import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SELLER = 'seller',
}

export class RegisterRequestDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'pass123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User role',
    example: '[user, admin, seller]',
  })
  @IsOptional()
  @IsString()
  role?: Role = Role.USER;
}
