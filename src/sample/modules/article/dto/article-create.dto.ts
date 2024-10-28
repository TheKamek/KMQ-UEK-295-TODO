import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ArticleCreateDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the article',
    default: 'mein Artikel',
    example: 'Beispiel Artikel',
  })
  name: string;
}
