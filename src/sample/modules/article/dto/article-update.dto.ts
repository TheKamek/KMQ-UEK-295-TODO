import { PartialType } from '@nestjs/swagger';
import { ArticleCreateDto } from './article-create.dto';

export class ArticleUpdateDto extends PartialType(ArticleCreateDto) {}
