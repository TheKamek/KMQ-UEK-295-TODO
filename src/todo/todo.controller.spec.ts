/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { UserService } from '../sample/modules/auth/user.service/user.service';
import { CreateTodoDto } from './DTO/create-todo.dto';
import { UpdateTodoDto } from './DTO/update-todo.dto';
import { ReturnTodoDto } from './DTO/return-todo.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserInfoDto } from '../sample/generic.dtos/userDtoAndEntity';

describe('TodoController', () => {
  let controller: TodoController;
  let todoService: TodoService;
  let userService: UserService;

  const mockTodoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAllOpen: jest.fn(),
    findAllClosed: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
      };
      const expectedResult: ReturnTodoDto = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        closed: false,
      };

      mockTodoService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);
      expect(result).toEqual(expectedResult);
      expect(mockTodoService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const expectedResult: ReturnTodoDto[] = [
        {
          id: 1,
          title: 'Todo 1',
          description: 'Desc 1',
          closed: false,
        },
        {
          id: 2,
          title: 'Todo 2',
          description: 'Desc 2',
          closed: false,
        },
      ];

      mockTodoService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();
      expect(result).toEqual(expectedResult);
      expect(mockTodoService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const expectedResult: ReturnTodoDto = {
        id: 1,
        title: 'Todo 1',
        description: 'Desc 1',
        closed: false,
      };

      mockTodoService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');
      expect(result).toEqual(expectedResult);
      expect(mockTodoService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when todo is not found', async () => {
      mockTodoService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateTodoDto = {
      title: 'Updated Todo',
      description: 'Updated Description',
    };

    it('should update a todo', async () => {
      const expectedResult: ReturnTodoDto = {
        id: 1,
        title: 'Updated Todo',
        description: 'Updated Description',
        closed: false,
      };

      mockTodoService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateDto);
      expect(result).toEqual(expectedResult);
      expect(mockTodoService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when todo to update is not found', async () => {
      mockTodoService.update.mockResolvedValue(null);

      await expect(controller.update('1', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePut', () => {
    const updateDto: UpdateTodoDto = {
      title: 'Updated Todo',
      description: 'Updated Description',
    };

    it('should update a todo using PUT', async () => {
      const expectedResult: ReturnTodoDto = {
        id: 1,
        title: 'Updated Todo',
        description: 'Updated Description',
        closed: false,
      };

      mockTodoService.update.mockResolvedValue(expectedResult);

      const result = await controller.updatePut('1', updateDto);
      expect(result).toEqual(expectedResult);
      expect(mockTodoService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when todo to update with PUT is not found', async () => {
      mockTodoService.update.mockResolvedValue(null);

      await expect(controller.updatePut('1', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a todo when user is admin', async () => {
      const user: UserInfoDto = {
        username: 'admin',
        roles: ['admin'],
        userId: 0,
      };
      const todoToDelete: ReturnTodoDto = {
        id: 1,
        title: 'Todo to delete',
        description: 'Description',
        closed: false,
      };

      mockUserService.findOne.mockResolvedValue({ roles: ['admin'] });
      mockTodoService.findOne.mockResolvedValue(todoToDelete);
      mockTodoService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1', user);
      expect(result).toMatchObject({
        description: 'Description',
        id: 1,
        title: 'Todo to delete',
      });

      expect(mockTodoService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException when user is not admin', async () => {
      const user: UserInfoDto = {
        username: 'user',
        roles: ['user'],
        userId: 0,
      };

      mockUserService.findOne.mockResolvedValue({ roles: ['user'] });

      await expect(controller.remove('1', user)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when todo to delete is not found', async () => {
      const user: UserInfoDto = {
        username: 'admin',
        roles: ['admin'],
        userId: 0,
      };

      mockUserService.findOne.mockResolvedValue({ roles: ['admin'] });
      mockTodoService.findOne.mockResolvedValue(null);

      await expect(controller.remove('1', user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllOpen', () => {
    it('should return all open todos', async () => {
      const expectedResult: ReturnTodoDto[] = [
        {
          id: 1,
          title: 'Open Todo 1',
          description: 'Desc 1',
          closed: false,
        },
        {
          id: 2,
          title: 'Open Todo 2',
          description: 'Desc 2',
          closed: false,
        },
      ];

      mockTodoService.findAllOpen.mockResolvedValue(expectedResult);

      const result = await controller.findAllOpen();
      expect(result).toEqual(expectedResult);
      expect(mockTodoService.findAllOpen).toHaveBeenCalled();
    });
  });

  describe('findAllClosed', () => {
    it('should return all closed todos', async () => {
      const expectedResult: ReturnTodoDto[] = [
        {
          id: 3,
          title: 'Closed Todo 1',
          description: 'Desc 3',
          closed: false,
        },
        {
          id: 4,
          title: 'Closed Todo 2',
          description: 'Desc 4',
          closed: false,
        },
      ];

      mockTodoService.findAllClosed.mockResolvedValue(expectedResult);

      const result = await controller.findAllClosed();
      expect(result).toEqual(expectedResult);
      expect(mockTodoService.findAllClosed).toHaveBeenCalled();
    });
  });
});
