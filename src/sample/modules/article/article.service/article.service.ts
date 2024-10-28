import { BadRequestException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { ArticleCreateDto } from '../dto/article-create.dto';
import { ArticleUpdateDto } from '../dto/article-update.dto';
import { BaseService } from '../../../base/base.service';
import { ArticleEntity } from '../entities/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService extends BaseService {
  constructor(@InjectRepository(ArticleEntity) private articleRepository: Repository<ArticleEntity>) {
    super('article.service');
  }

  async findAll(corrId: number): Promise<ArticleEntity[]> {
    const method = 'findAll';
    this.wl(corrId, method);
    // just return the full array content
    const ret = await this.articleRepository.find();
    this.wl(corrId, method, `we return all items in the array. Current length is ${ret.length}`);
    this.wl(corrId, method, `ret: ${JSON.stringify(ret, null, 2)}`);
    return ret;
  }

  async findOne(corrId: number, id: number): Promise<ArticleEntity> {
    const methodName = 'findOne';
    this.wl(corrId, methodName);
    const article: ArticleEntity = await this.articleRepository.findOneBy({ id });
    // check if the id was found. find returns undefined in case nothing was found
    if (!article) {
      const msg = `We did not found a article item with id ${id}!`;
      this.wl(corrId, methodName, msg);
      throw new NotFoundException(msg);
    }
    this.wl(corrId, methodName, `we find article item with id: ${id}. ret: ${JSON.stringify(article, null, 2)}`);
    return article;
  }

  async create(corrId: number, createArticleEntity: ArticleCreateDto): Promise<ArticleEntity> {
    const method = 'create';
    this.wl(corrId, method);
    // extend the createDto with the timestamp
    const article: ArticleEntity = { ...createArticleEntity, id: null };
    // check if all required fields are set, if not the method is throw an error
    this.checkForAllRequiredProperties(corrId, article);
    // create the object and convert the return value to the right datatype
    const identifier = (await this.articleRepository.insert(article)).identifiers;
    const obj = await this.articleRepository.findOneBy(identifier[0]);
    this.wl(corrId, method, `create a new article item with id: ${article.id}. ret: ${JSON.stringify(obj, null, 2)}`);
    return obj;
  }

  async replace(corrId: number, id: number, entity: ArticleEntity): Promise<ArticleEntity> {
    const method = 'replace';
    this.wl(corrId, method);
    // check if all required fields are set, if not the method is throw an error
    this.checkForAllRequiredProperties(corrId, entity);

    // check that the resource id is equal to the object id
    if (id !== entity.id) {
      const msg = `You try to replace the id ${id} with an object who has the id ${entity.id} this is now allowed as otherwise we can have multiple times the same id!`;
      this.wl(corrId, method, msg);
      throw new BadRequestException(msg);
    }
    // check if the id already exist
    const oldObj = await this.articleRepository.findOneBy({ id });
    if (!oldObj) {
      const msg = `You can't replace a non existing entity item with id ${id}! Consider to post a new record.`;
      this.wl(corrId, method, msg);
      throw new MethodNotAllowedException(msg);
    }
    // we update the old one
    this.wl(corrId, method, `Add the replacement element to the array`);
    await this.articleRepository.update({ id }, this.sanitizeTodoObject(corrId, entity));
    const obj = await this.articleRepository.findOneBy({ id });
    this.wl(corrId, method, `ret: ${JSON.stringify(obj, null, 2)}`);
    return obj;
  }

  async update(corrId: number, id: number, updateArticleEntity: ArticleUpdateDto): Promise<ArticleEntity> {
    const method = 'update';
    this.wl(corrId, method);
    const oldObj = await this.articleRepository.findOneBy({ id });
    // check if the id was found. find returns undefined in case nothing was found
    if (!oldObj) {
      const msg = `We did not found a article item with id ${id}!`;
      this.wl(corrId, method, msg);
      throw new NotFoundException(msg);
    }
    // we update now all the fields from the updateArticleEntity
    for (const key of Object.keys(updateArticleEntity)) {
      // hint: this part of the code ensure, that you only update existing properties. so you can't add new properties. Attention, this will only work if the properties always must have a value
      if (oldObj[key]) {
        // replace the value
        oldObj[key] = updateArticleEntity[key];
      } else {
        this.wl(
          corrId,
          method,
          `We found the property ${key} in the updateArticleEntity but we could not find a property with values in the existing object. We ignore this property and we will not inform the client about that!`,
        );
      }
    }
    // update
    await this.articleRepository.update({ id }, oldObj);
    const obj = await this.articleRepository.findOneBy({ id });
    this.wl(
      corrId,
      method,
      `we find article item with id: ${id} and added the new values ${JSON.stringify(obj, null, 2)}!`,
    );
    return obj;
  }

  async remove(corrId: number, id: number): Promise<ArticleEntity> {
    const methodName = 'remove';
    this.wl(corrId, methodName);
    const oldObj = await this.articleRepository.findOneBy({ id });
    // check if the id was found. find returns undefined in case nothing was found
    if (!oldObj) {
      const msg = `We did not found a article item with id ${id}!`;
      this.wl(corrId, methodName, msg);
      throw new NotFoundException(msg);
    }
    await this.articleRepository.delete({ id });
    this.wl(
      corrId,
      methodName,
      `we find article item with id: ${id} so we deleted it! ret: ${JSON.stringify(oldObj, null, 2)}`,
    );
    return oldObj;
  }

  private checkForAllRequiredProperties(corrId: number, article: ArticleEntity) {
    const methodName = 'checkForAllRequiredProperties';
    this.wl(corrId, methodName);
    // if (!article.id) {
    //   const msg = `The required field id is missing in the object!`;
    //   this.wl(corrId, methodName, msg);
    //   throw new BadRequestException(msg);
    // }
    if (!article.name) {
      const msg = `The required field name is missing in the object!`;
      this.wl(corrId, methodName, msg);
      throw new BadRequestException(msg);
    }
  }
  private sanitizeTodoObject(corrId: number, article: ArticleEntity): ArticleEntity {
    const methodName = 'sanitizeTodoObject';
    this.wl(corrId, methodName);
    return {
      id: article.id,
      name: article.name,
    };
  }
}
