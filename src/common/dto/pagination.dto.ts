import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';
import { PAGINATION } from '../constants/pagination.constant';

export class PaginationQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page: number = PAGINATION.DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit: number = PAGINATION.DEFAULT_LIMIT;
}
