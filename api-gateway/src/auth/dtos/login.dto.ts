import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
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
}
