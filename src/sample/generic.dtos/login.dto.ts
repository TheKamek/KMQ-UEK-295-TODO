import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The username',
    default: 'user',
  })
  username: string;
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password',
    default: '12345',
  })
  password: string;
}
