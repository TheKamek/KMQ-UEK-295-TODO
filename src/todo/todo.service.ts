// src/sample/modules/todo/todo.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entities';
import { CreateTodoDto } from './DTO/create-todo.dto';
import { UpdateTodoDto } from './DTO/update-todo.dto';
import { ReturnTodoDto } from './DTO/return-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<ReturnTodoDto> {
    try {
      if (!createTodoDto.description) {
        throw new BadRequestException('The required field description is missing in the object!');
      }

      if (!createTodoDto.title) {
        throw new BadRequestException('The required field title is missing in the object!');
      }
      const todo = this.todoRepository.create({
        ...createTodoDto,
        closed: false,
      });

      const savedTodo = await this.todoRepository.save(todo);
      return this.transformToReturnDto(savedTodo);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create todo. Please check your input.');
    }
  }

  async findAll(): Promise<ReturnTodoDto[]> {
    const todos = await this.todoRepository.find({
      order: {
        id: 'DESC',
      },
    });
    return todos.map((todo) => this.transformToReturnDto(todo));
  }

  async findOne(id: number): Promise<ReturnTodoDto> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`We did not found a todo item with id ${id}!`);
    }
    return this.transformToReturnDto(todo);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<ReturnTodoDto> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`We did not found a todo item with id ${id}!`);
    }

    await this.todoRepository.update(id, updateTodoDto);
    const updatedTodo = await this.todoRepository.findOneBy({ id });
    return this.transformToReturnDto(updatedTodo);
  }

  async updatePut(id: number, updateTodoDto: UpdateTodoDto): Promise<ReturnTodoDto> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`We did not found a todo item with id ${id}!`);
    }

    await this.todoRepository.update(id, updateTodoDto);
    const updatedTodo = await this.todoRepository.findOneBy({ id });
    return this.transformToReturnDto(updatedTodo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`We did not found a todo item with id ${id}!`);
    }
  }

  async findAllOpen(): Promise<ReturnTodoDto[]> {
    const todos = await this.todoRepository.find({
      where: { closed: false },
      order: { id: 'DESC' },
    });
    return todos.map((todo) => this.transformToReturnDto(todo));
  }

  async findAllClosed(): Promise<ReturnTodoDto[]> {
    const todos = await this.todoRepository.find({
      where: { closed: true },
      order: { id: 'DESC' },
    });
    return todos.map((todo) => this.transformToReturnDto(todo));
  }

  private transformToReturnDto(todo: Todo): ReturnTodoDto {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      closed: todo.closed,
    };
  }

  async search(query: string): Promise<ReturnTodoDto[]> {
    const todos = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.title LIKE :query OR todo.description LIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('todo.id', 'DESC')
      .getMany();

    return todos.map((todo) => this.transformToReturnDto(todo));
  }

  async toggleStatus(id: number): Promise<ReturnTodoDto> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`We did not found a todo item with id ${id}!`);
    }

    todo.closed = !todo.closed;
    const updatedTodo = await this.todoRepository.save(todo);
    return this.transformToReturnDto(updatedTodo);
  }
}
