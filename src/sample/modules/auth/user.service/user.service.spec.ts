import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get not existing user', async () => {
    const username = 'notFound';
    expect(await service.findOne(username)).toEqual(undefined);
  });
  it('get  user', async () => {
    const username = 'user';
    expect(await service.findOne(username)).toEqual({
      password: '12345',
      roles: ['user'],
      userId: 1,
      username: 'user',
    });
  });
  it('get admin', async () => {
    const username = 'admin';
    expect(await service.findOne(username)).toEqual({
      password: '12345',
      roles: ['user', 'admin'],
      userId: 2,
      username: 'admin',
    });
  });
});
