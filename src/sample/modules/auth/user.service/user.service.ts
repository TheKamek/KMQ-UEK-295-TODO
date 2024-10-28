import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../generic.dtos/userDtoAndEntity';

@Injectable()
export class UserService {
  private readonly users: UserEntity[] = [
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

  async findOne(username: string): Promise<UserEntity | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
