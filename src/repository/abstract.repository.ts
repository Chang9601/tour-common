import { FilterQuery, Model, Query, UpdateQuery } from 'mongoose';

import { AbstractDocument } from '../type/abstract.schema';
import { DocumentNotFoundError } from '../error/document-not-found.error';
import { Code } from '../code/code';
import { AbstractQuery } from '../type/query-type';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  public async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    return this.model.create(document);
  }

  public findAll(): AbstractQuery<TDocument> {
    return this.model.find().lean<TDocument[]>(true);
  }

  public async find(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filter); //.lean<TDocument>(true);

    if (!document) {
      throw new DocumentNotFoundError(
        Code.NOT_FOUND.code,
        Code.NOT_FOUND.message,
        '도큐먼트가 존재하지 않습니다.'
      );
    }

    return document;
  }

  public async update(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filter, update, {
        new: true,
      })
      .lean<TDocument>();

    if (!document) {
      throw new DocumentNotFoundError(
        Code.NOT_FOUND.code,
        Code.NOT_FOUND.message,
        '도큐먼트가 존재하지 않습니다.'
      );
    }

    return document;
  }

  public async delete(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOneAndDelete(filter)
      .lean<TDocument>(true);

    if (!document) {
      throw new DocumentNotFoundError(
        Code.NOT_FOUND.code,
        Code.NOT_FOUND.message,
        '도큐먼트가 존재하지 않습니다.'
      );
    }

    return document;
  }
}
