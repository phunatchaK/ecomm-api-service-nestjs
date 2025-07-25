import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export function applyPaginationAndSorting<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  page: number,
  limit: number,
  orderBy?: string
): SelectQueryBuilder<T> {
  qb.skip((page - 1) * limit).take(limit);

  if (orderBy) {
    const [field, direction] = orderBy.split(':');
    qb.orderBy(field, direction.toLocaleUpperCase() === 'DESC' ? 'DESC' : 'ASC');
  }

  return qb;
}
