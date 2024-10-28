import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from '../article.service/article.service';
import { UserEntity } from '../../../generic.dtos/userDtoAndEntity';
import { ArticleEntity } from '../entities/article.entity';

const userUser: UserEntity = {
  userId: 1,
  username: 'user',
  password: '12345',
  roles: ['user'],
};
const adminUser: UserEntity = {
  userId: 2,
  username: 'admin',
  password: '12345',
  roles: ['user', 'admin'],
};

const articleId1: ArticleEntity = {
  id: 1,
  name: 'Mein Artikel',
};
class ArticleServiceMockup {
  findAll() {
    return [];
  }
  findOne() {
    return articleId1;
  }
  create() {
    return articleId1;
  }
  replace() {
    return articleId1;
  }
  update() {
    return articleId1;
  }
  remove() {
    return articleId1;
  }
}

describe('ArticleController', () => {
  let controller: ArticleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [{ provide: ArticleService, useClass: ArticleServiceMockup }],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAll', async () => {
    expect(await controller.findAll(0)).toEqual([]);
  });
  it('findOne', async () => {
    expect(await controller.findOne(0, 1)).toEqual(articleId1);
  });
  it('create', async () => {
    expect(await controller.create(0, { name: 'Mein Artikel' })).toEqual(articleId1);
  });
  it('replace', async () => {
    expect(await controller.replace(0, 1, articleId1)).toEqual(articleId1);
  });
  it('update', async () => {
    expect(await controller.update(0, 1, { name: 'Mein Artikel' })).toEqual(articleId1);
  });
  it('remove working as admin', async () => {
    expect(await controller.remove(adminUser, 0, 1)).toEqual(articleId1);
  });
  it('remove not working as user', async () => {
    try {
      await controller.remove(userUser, 0, 1);
    } catch (err: any) {
      expect(err.message).toBe('You have to be member of the role admin to call this method!');
    }
  });
});
