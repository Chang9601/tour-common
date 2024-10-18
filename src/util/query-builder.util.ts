import { RequestQuery } from '../type/query-request.type';
import { FindQuery } from '../type/find-query.type';

export class QueryBuilder<TDocument> {
  public query: FindQuery<TDocument>;
  public queryString: RequestQuery;

  constructor(query: FindQuery<TDocument>, queryString: RequestQuery) {
    this.query = query;
    this.queryString = queryString;
  }

  public filter(): QueryBuilder<TDocument> {
    /* 1. 필터링 */
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((element) => delete queryObject[element]);

    /*
     * 2. 고급 필터링
     * tours?durations[gte]=5&difficult=easy)
     * { difficult: 'easy', duraiton: { gte: '5' } } -> $를 추가한다.
     */
    const rawFilter = JSON.stringify(queryObject);
    const processedFilter = rawFilter.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(processedFilter));

    /* 메서드 체이닝을 위해 this(즉, 객체 전체)를 반환한다. */
    return this;
  }

  public sort(): QueryBuilder<TDocument> {
    /*
     * 3. 정렬
     * tours?sort=-price,ratingAverage
     * Mongoose는 -를 자동으로 내림차순으로 해석한다.
     */
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.split(',').join(' '));
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  public project(): QueryBuilder<TDocument> {
    /*
     * 4. 필드 선택
     * tours?fields=name,duration,price
     */
    if (this.queryString.fields) {
      this.query = this.query.select(
        this.queryString.fields.split(',').join(' ')
      );
    } else {
      /* -는 해당 필드를 제거한다.  */
      this.query = this.query.select('-__v');
    }

    return this;
  }

  public paginate(): QueryBuilder<TDocument> {
    /*
     * 5. 페이지네이션
     * page=2&limit=10 -> 1-10 page 1 11-20 page 2 21-30 page 3
     */
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;

    /*
     * 결과가 없는 것 자체로 사용자는 요청한 페이지에는 데이터가 없다는 것을 확인한다.
     * 그러므로 예외 처리를 할 필요가 없다.
     */
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
