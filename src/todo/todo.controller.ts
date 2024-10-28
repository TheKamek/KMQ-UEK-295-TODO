import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './DTO/create-todo.dto';
import { UpdateTodoDto } from './DTO/update-todo.dto';
import { ReturnTodoDto } from './DTO/return-todo.dto';
import { JwtAuthGuard } from '../sample/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../sample/decorators/current-user/current-user.decorator';
import { UserInfoDto } from '../sample/generic.dtos/userDtoAndEntity';
import { UserService } from '../sample/modules/auth/user.service/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Todo')
@ApiBearerAuth()
@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateTodoDto): Promise<ReturnTodoDto> {
    return await this.todoService.create(createDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ReturnTodoDto[]> {
    return await this.todoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ReturnTodoDto> {
    const todo = await this.todoService.findOne(+id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateDto: UpdateTodoDto): Promise<ReturnTodoDto> {
    const todo = await this.todoService.update(+id, updateDto);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updatePut(@Param('id') id: string, @Body() updateDto: UpdateTodoDto): Promise<ReturnTodoDto> {
    const todo = await this.todoService.update(+id, updateDto);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @CurrentUser() user: UserInfoDto): Promise<ReturnTodoDto> {
    const userEntity = await this.userService.findOne(user.username);
    if (!userEntity.roles.includes('admin')) {
      throw new ForbiddenException('You have to be member of the role admin to call this method!');
    }
    const todo = await this.todoService.findOne(+id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    await this.todoService.remove(+id);

    const returnTodoDto = new ReturnTodoDto();
    returnTodoDto.id = todo.id;
    returnTodoDto.title = todo.title;
    returnTodoDto.description = todo.description;

    return returnTodoDto;
  }

  @Get('status/open')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAllOpen(): Promise<ReturnTodoDto[]> {
    return await this.todoService.findAllOpen();
  }

  @Get('status/closed')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAllClosed(): Promise<ReturnTodoDto[]> {
    return await this.todoService.findAllClosed();
  }
}
