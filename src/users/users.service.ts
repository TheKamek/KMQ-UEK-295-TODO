import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'user',
      password: '12345',
      roles: ['user'],
    },
    {
      userId: 2,
      username: 'admin',
      password: '12345',
      roles: ['user', 'admin'],
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
