import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorUnauthorizedDto } from '../../../generic.dtos/error.unauthorized.dto';
import { ErrorDto } from '../../../generic.dtos/error.dto';
import { UserEntity } from '../../../generic.dtos/userDtoAndEntity';
import { BaseController } from '../../../base/base.controller';
import { ArticleService } from '../article.service/article.service';
import { ArticleReturnDto } from '../dto/article-return-dto';
import { ArticleCreateDto } from '../dto/article-create.dto';
import { ArticleUpdateDto } from '../dto/article-update.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CorrId } from '../../../decorators/correlation-id/correlation-id.decorator';
import { CurrentUser } from '../../../decorators/current-user/current-user.decorator';

@Controller('article')
@ApiTags('Article Methods')
@ApiBearerAuth()
export class ArticleController extends BaseController {
  constructor(private readonly articleService: ArticleService) {
    super('ArticleController');
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ description: 'The record has been found.', type: ArticleReturnDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async findAll(@CorrId() corrId: number): Promise<ArticleReturnDto[]> {
    const methodName = 'findAll';
    this.wl(corrId, methodName);
    const arr = await this.articleService.findAll(corrId);
    return arr.map((item) => ArticleReturnDto.ConvertEntityToDto(item));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({ description: 'The record has been found.', type: ArticleReturnDto })
  @ApiNotFoundResponse({ description: 'The record has not been found.', type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async findOne(@CorrId() corrId: number, @Param('id', ParseIntPipe) id: number): Promise<ArticleReturnDto> {
    const methodName = 'findOne';
    this.wl(corrId, methodName);
    const item = await this.articleService.findOne(corrId, id);
    return ArticleReturnDto.ConvertEntityToDto(item);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: ArticleReturnDto })
  @ApiMethodNotAllowedResponse({ description: `You don't have the right to access this record.`, type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async create(@CorrId() corrId: number, @Body() createArticleEntity: ArticleCreateDto): Promise<ArticleReturnDto> {
    const methodName = 'create';
    this.wl(corrId, methodName);
    const item = await this.articleService.create(corrId, createArticleEntity);
    return ArticleReturnDto.ConvertEntityToDto(item);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOkResponse({ description: 'The record has been successfully replaced.', type: ArticleReturnDto })
  @ApiBadRequestResponse({ description: `You not allowed to replace the record.`, type: ErrorDto })
  @ApiMethodNotAllowedResponse({ description: `You don't have the right to access this record.`, type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async replace(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() todo: ArticleReturnDto,
  ): Promise<ArticleReturnDto> {
    const methodName = 'replace';
    this.wl(corrId, methodName);
    const item = await this.articleService.replace(corrId, id, todo);
    return ArticleReturnDto.ConvertEntityToDto(item);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({ description: 'The record has been successfully updated.', type: ArticleReturnDto })
  @ApiNotFoundResponse({ description: 'The record has not been found.', type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async update(
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleEntity: ArticleUpdateDto,
  ): Promise<ArticleReturnDto> {
    const methodName = 'update';
    this.wl(corrId, methodName);
    const item = await this.articleService.update(corrId, id, updateArticleEntity);
    return ArticleReturnDto.ConvertEntityToDto(item);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'The record has been successfully deleted.', type: ArticleReturnDto })
  @ApiNotFoundResponse({ description: 'The record has not been found.', type: ErrorDto })
  @ApiForbiddenResponse({ description: '', type: ErrorDto })
  @ApiUnauthorizedResponse({ description: 'Not logged in!', type: ErrorUnauthorizedDto })
  async remove(
    @CurrentUser() user: UserEntity,
    @CorrId() corrId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleReturnDto> {
    const methodName = 'remove';
    // hint: usually we should do this with a guard, I just this example here to explain how we can access the user context in a method
    if (user.roles.find((f) => f === 'admin')) {
      this.wl(corrId, methodName);
      const item = await this.articleService.remove(corrId, id);
      return ArticleReturnDto.ConvertEntityToDto(item);
    } else {
      throw new ForbiddenException('You have to be member of the role admin to call this method!');
    }
  }
}
