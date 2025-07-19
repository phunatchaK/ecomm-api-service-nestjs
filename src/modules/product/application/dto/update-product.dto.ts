import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
