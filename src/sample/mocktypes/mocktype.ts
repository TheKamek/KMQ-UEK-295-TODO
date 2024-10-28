import { Repository } from 'typeorm';

export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

export const RepositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  find: jest.fn((entity) => entity),
  findOneBy: jest.fn((entity) => entity),
  insert: jest.fn((entity) => entity),
  update: jest.fn((entity) => entity),
  delete: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
  exists: jest.fn((entity) => entity),
  existsBy: jest.fn((entity) => entity),
  preload: jest.fn((entity) => entity),
}));
