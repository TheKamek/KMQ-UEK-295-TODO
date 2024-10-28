import { ApiProperty } from '@nestjs/swagger';

export class BearerDto {
  @ApiProperty({
    description: 'The JWT token',
  })
  token: string;
}
