import { RequestQuery } from '../type/query-request';
import { FindQuery } from '../type/find-query';

export class QueryBuilder<TDocument> {
  public query: FindQuery<TDocument>;
  public queryString: RequestQuery;

  constructor(query: FindQuery<TDocument>, queryString: RequestQuery) {
    this.query = query;
    this.queryString = queryString;
  }

  public filter(): QueryBuilder<TDocument> {
    /* 1. 필터링 */
    const queryString = { ...this.queryString };
    const excluded = ['page', 'sort', 'limit', 'fields'];
    excluded.forEach((element) => delete queryString[element]);

    /* 2. 고급 필터링 TODO: 예시 적기. */
    let filter = JSON.stringify(queryString);
    filter = filter.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(filter));

    /* 메서드 체이닝을 위해 this(즉, 객체 전체)를 반환한다. */
    return this;
  }

  public sort(): QueryBuilder<TDocument> {
    /* 3. 정렬 */
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  public project(): QueryBuilder<TDocument> {
    /* 4. 필드 선택 */
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  public paginate(): QueryBuilder<TDocument> {
    /*
     * 5. 페이지네이션
     * page=2&limit=10 -> 1-10 page1 11-20 page2 21-30 page3
     */
    const page = +this.queryString.page;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    /*
     * 결과가 없는 것 자체로 사용자는 요청한 페이지에는 데이터가 없다는 것을 확인한다.
     * 그러므로 예외 처리를 할 필요가 없다.
     */
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
