import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';

export enum StockMovementType {
  PURCHASE_IN = 'PI',
  PURCHASE_OUT = 'PO',
  TRANSFER = 'TRANSFER',
}

export class StockMovementDto {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  warehouseId: number;

  @IsEnum(StockMovementType)
  movement_type: StockMovementType;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unit_cost: number;
}
