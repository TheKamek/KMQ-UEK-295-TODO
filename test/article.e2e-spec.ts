import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ArticleReturnDto } from '../src/sample/modules/article/dto/article-return-dto';
import { ArticleCreateDto } from '../src/sample/modules/article/dto/article-create.dto';
import { TestHttpClient } from './testing-tools/test-http-client';
import { DbFileTools } from './testing-tools/db-file.tools';

describe('Article (e2e)', () => {
  const tableName = 'article';
  let app: INestApplication;
  let httpClient: TestHttpClient;

  // set environment and delete the file
  const dbName = DbFileTools.resetTestDatabase(tableName);
  if (!dbName) {
    console.warn(`could not delete database ${dbName}`);
  }
  process.env.DATABASE_NAME = dbName;
  // we override here the default log behavior for the database, so we don't see sql messages
  process.env.DATABASE_LOG = 'false';

  // temp values
  let status = 0;
  let answer: any;

  beforeAll(async () => {
    // delete the database
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    // create nest app
    app = moduleFixture.createNestApplication();
    // init app
    await app.init();
    // init httpClient
    httpClient = new TestHttpClient(app, tableName);
    // prepare tokens
    await httpClient.createTokens();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  it(`${tableName}/ check all`, async () => {
    //get all empty arrays
    await httpClient.execGetArray(200, 0);

    // get one with not existing id
    status = 404;
    answer = {
      statusCode: status,
      message: `We did not found a ${httpClient.tableName} item with id -1!`,
      error: 'Not Found',
    };
    await httpClient.exeGetOne(status, -1, answer);

    // post a new empty object
    status = 400;
    answer = {
      statusCode: status,
      message: 'The required field name is missing in the object!',
      error: 'Bad Request',
    };
    await httpClient.exePost(httpClient.userToken, status, {}).expect(answer);
    await httpClient.exePost(httpClient.adminToken, status, {}).expect(answer);

    // post new missing name
    status = 400;
    answer = {
      statusCode: status,
      message: 'The required field name is missing in the object!',
      error: 'Bad Request',
    };
    await httpClient.exePost(httpClient.userToken, status, { id: 1 }).expect(answer);
    await httpClient.exePost(httpClient.adminToken, status, { id: 1 }).expect(answer);

    // post new valid
    const articleReturnDto: ArticleReturnDto = {
      id: 1,
      name: 'sample content',
    };
    const articleCreateDto1: ArticleCreateDto = {
      name: articleReturnDto.name,
    };
    status = 201;
    await httpClient.exePost(httpClient.userToken, status, articleCreateDto1).expect((res) => {
      const body: ArticleReturnDto = res.body;
      expect(body.id).toBe(1);
      expect(body.name).toBe(articleReturnDto.name);
    });

    const name2 = articleReturnDto.name + ' 2';
    const articleCreateDto2: ArticleCreateDto = {
      name: name2,
    };
    await httpClient.exePost(httpClient.userToken, status, articleCreateDto2).expect((res) => {
      const body: ArticleReturnDto = res.body;
      expect(body.id).toBe(2);
      expect(body.name).toBe(name2);
    });

    //get all arrays 2
    await httpClient.execGetArray(200, 2);

    // put valid (id 1)
    status = 200;
    httpClient.execPut(httpClient.userToken, status, 1, articleReturnDto).expect((res) => {
      const body: ArticleReturnDto = res.body;
      expect(body.id).toBe(1);
      expect(body.name).toBe(articleReturnDto.name);
    });
    // put invalid ids (2)
    status = 400;
    answer = {
      statusCode: status,
      message:
        'You try to replace the id 1 with an object who has the id 2 this is now allowed as otherwise we can have multiple times the same id!',
      error: 'Bad Request',
    };
    httpClient.execPut(httpClient.userToken, status, 1, { ...articleReturnDto, id: 2 }).expect(answer);

    // put wrong id -1
    status = 404;
    answer = {
      statusCode: status,
      message:
        'You try to replace the id 1 with an object who has the id 2 this is now allowed as otherwise we can have multiple times the same id!',
      error: 'Bad Request',
    };
    httpClient.execPut(httpClient.userToken, status, -1, articleReturnDto).expect(answer);

    // put missing name
    status = 400;
    answer = {
      statusCode: status,
      message: 'The required field name is missing in the object!',
      error: 'Bad Request',
    };
    httpClient.execPut(httpClient.userToken, status, -1, { id: 1 }).expect(answer);

    // Put valid with more fields (id 1)
    status = 200;
    httpClient
      .execPut(httpClient.userToken, status, 1, {
        ...articleReturnDto,
        name: 'new sample name',
        additionalInformation: { info: 'some information', info2: 4 },
      })
      .expect((res) => {
        const body: ArticleReturnDto = res.body;
        expect(body.id).toBe(1);
        expect(body.name).toBe('new sample content');
      });

    // Patch valid name (id 1)
    status = 200;
    await httpClient
      .execPatch(httpClient.userToken, status, 1, {
        name: 'patched name',
      })
      .expect((res) => {
        const body: ArticleReturnDto = res.body;
        expect(body.id).toBe(1);
        expect(body.name).toBe('patched name');
      });

    // delete aren't allowed
    status = 403;
    answer = {
      statusCode: status,
      message: 'You have to be member of the role admin to call this method!',
      error: 'Forbidden',
    };
    await httpClient.execDel(httpClient.userToken, status, -1).expect(answer);

    // delete not existing (id-1)
    status = 404;
    answer = {
      statusCode: status,
      message: 'We did not found a article item with id -1!',
      error: 'Not Found',
    };
    await httpClient.execDel(httpClient.adminToken, status, -1).expect(answer);

    // Delete existing (id 1)
    status = 200;
    await httpClient.execDel(httpClient.adminToken, status, 1).expect((res) => {
      const body: ArticleReturnDto = res.body;
      expect(body.id).toBe(1);
      expect(body.name).toBe('patched name');
    });

    // get alle, should have 1
    await httpClient.execGetArray(200, 1);

    // Delete existing (id 2)
    status = 200;
    await httpClient.execDel(httpClient.adminToken, status, 2).expect((res) => {
      const body: ArticleReturnDto = res.body;
      expect(body.id).toBe(2);
      expect(body.name).toBe('sample content 2');
    });

    //get all empty arrays
    await httpClient.execGetArray(200, 0);
  });
});
