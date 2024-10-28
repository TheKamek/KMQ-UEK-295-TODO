/* eslint-disable @typescript-eslint/no-unused-vars */
// src/todo/todo.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './DTO/create-todo.dto';
import { UpdateTodoDto } from './DTO/update-todo.dto';
import { ReturnTodoDto } from './DTO/return-todo.dto';

describe('TodoService', () => {
  let service: TodoService;
  let repository: Repository<Todo>;

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    closed: false,
    createdAt: undefined,
    updatedAt: undefined,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTodoDto: CreateTodoDto = {
      title: 'Test Todo',
      description: 'Test Description',
    };

    it('should successfully create a todo', async () => {
      mockRepository.create.mockReturnValue(mockTodo);
      mockRepository.save.mockResolvedValue(mockTodo);

      const result = await service.create(createTodoDto);
      expect(result).toEqual(service.transformToReturnDto(mockTodo));
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createTodoDto,
        closed: false,
      });
    });

    it('should throw BadRequestException when title is missing', async () => {
      const invalidDto = { description: 'Test Description' } as CreateTodoDto;
      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when description is missing', async () => {
      const invalidDto = { title: 'Test Todo' } as CreateTodoDto;
      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on save error', async () => {
      mockRepository.create.mockReturnValue(mockTodo);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createTodoDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const todos = [mockTodo];
      mockRepository.find.mockResolvedValue(todos);

      const result = await service.findAll();
      expect(result).toEqual(todos.map((todo) => service.transformToReturnDto(todo)));
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { id: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockTodo);

      const result = await service.findOne(1);
      expect(result).toEqual(service.transformToReturnDto(mockTodo));
    });

    it('should throw NotFoundException when todo is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateTodoDto: UpdateTodoDto = {
      title: 'Updated Todo',
      description: 'Updated Description',
    };

    it('should update a todo', async () => {
      const updatedTodo = { ...mockTodo, ...updateTodoDto };
      mockRepository.findOneBy.mockResolvedValueOnce(mockTodo);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValueOnce(updatedTodo);

      const result = await service.update(1, updateTodoDto);
      expect(result).toEqual(service.transformToReturnDto(updatedTodo));
    });

    it('should throw NotFoundException when todo to update is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, updateTodoDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePut', () => {
    const updateTodoDto: UpdateTodoDto = {
      title: 'Updated Todo',
      description: 'Updated Description',
    };

    it('should update a todo using PUT', async () => {
      const updatedTodo = { ...mockTodo, ...updateTodoDto };
      mockRepository.findOneBy.mockResolvedValueOnce(mockTodo);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValueOnce(updatedTodo);

      const result = await service.updatePut(1, updateTodoDto);
      expect(result).toEqual(service.transformToReturnDto(updatedTodo));
    });

    it('should throw NotFoundException when todo to update is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updatePut(1, updateTodoDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should successfully remove a todo', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.not.toThrow();
    });

    it('should throw NotFoundException when todo to remove is not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllOpen', () => {
    it('should return all open todos', async () => {
      const openTodos = [mockTodo];
      mockRepository.find.mockResolvedValue(openTodos);

      const result = await service.findAllOpen();
      expect(result).toEqual(openTodos.map((todo) => service.transformToReturnDto(todo)));
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { closed: false },
        order: { id: 'DESC' },
      });
    });
  });

  describe('findAllClosed', () => {
    it('should return all closed todos', async () => {
      const closedTodos = [{ ...mockTodo, closed: true }];
      mockRepository.find.mockResolvedValue(closedTodos);

      const result = await service.findAllClosed();
      expect(result).toEqual(closedTodos.map((todo) => service.transformToReturnDto(todo)));
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { closed: true },
        order: { id: 'DESC' },
      });
    });
  });

  describe('search', () => {
    it('should return todos matching search query', async () => {
      const searchResults = [mockTodo];
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(searchResults),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.search('test');
      expect(result).toEqual(searchResults.map((todo) => service.transformToReturnDto(todo)));
      expect(queryBuilder.where).toHaveBeenCalledWith('todo.title LIKE :query OR todo.description LIKE :query', {
        query: `%test%`,
      });
    });
  });

  describe('toggleStatus', () => {
    it('should toggle todo status from open to closed', async () => {
      const originalTodo = mockTodo;
      const toggledTodo = { ...mockTodo, closed: true };

      mockRepository.findOneBy.mockResolvedValue(originalTodo);
      mockRepository.save.mockResolvedValue(toggledTodo);

      const result = await service.toggleStatus(1);
      expect(result).toEqual(service.transformToReturnDto(toggledTodo));
    });

    it('should throw NotFoundException when todo is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.toggleStatus(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('transformToReturnDto', () => {
    it('should transform todo entity to return DTO', () => {
      const result = service.transformToReturnDto(mockTodo);
      expect(result).toEqual({
        id: mockTodo.id,
        title: mockTodo.title,
        description: mockTodo.description,
        closed: mockTodo.closed,
      });
    });
  });
});
