import { ApiProperty } from '@nestjs/swagger';

export class ErrorUnauthorizedDto {
  @ApiProperty({
    description: 'The http status code',
    minimum: 100,
    default: 400,
    example: 400,
  })
  statusCode: number;
  @ApiProperty({
    description: 'The error message',
    default: 'This is an error message',
    example: 'We did not found an item with id xxx!',
  })
  message: string;
}
