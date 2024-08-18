import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { Code } from '../code/code';
import { DocumentNotFoundError } from '../error/document-not-found.error';
import { CoreDocument } from '../schema/core.schema';
import { FindQuery } from '../type/find-query';
import { Nullable } from '../type/nullish.type';

export abstract class CoreRepository<TDocument extends CoreDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  public async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    return await this.model.create(document);
  }

  public findAll(filter?: FilterQuery<TDocument>): FindQuery<TDocument> {
    /*
     * lean() 메서드를 호출하면 toJSON() 메서드와 toObject() 메서드가 적용되지 않는다.
     * lean() 메서드를 적용하면 쿼리의 반환값은 Mongoose 도큐먼트가 아니라 일반 JavaScript 객체이다.
     */
    return filter ? this.model.find(filter) : this.model.find(); //.lean<TDocument[]>(true);
  }

  public async find(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filter); //.lean<TDocument>(true);

    if (!document) {
      throw new DocumentNotFoundError(
        Code.NOT_FOUND,
        '도큐먼트가 존재하지 않습니다.'
      );
    }

    return document;
  }

  public async update(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filter, update, {
      new: true /* 갱신된 도큐먼트를 반환한다. */,
      runValidators: true /* 갱신마다 유효성을 확인한다. */,
    });
    //.lean<TDocument>();

    if (!document) {
      throw new DocumentNotFoundError(
        Code.NOT_FOUND,
        '도큐먼트가 존재하지 않습니다.'
      );
    }

    return document;
  }

  public async delete(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOneAndDelete(filter);
    //.lean<TDocument>(true);

    if (!document) {
      throw new DocumentNotFoundError(
        Code.NOT_FOUND,
        '도큐먼트가 존재하지 않습니다.'
      );
    }

    return document;
  }
}
