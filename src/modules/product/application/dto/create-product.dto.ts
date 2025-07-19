import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;
}
