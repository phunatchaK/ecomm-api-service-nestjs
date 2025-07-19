import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';

export enum StockMovementType {
  PURCHASE_IN = 'PI',
  PURCHASE_OUT = 'PO',
}

export class StockMovementDto {
  @IsNotEmpty()
  productId: number;

  @IsEnum(StockMovementType)
  movement_type: StockMovementType;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unit_cost: number; // ถ้าเป็น PO ส่ง 0 หรือไม่ใช้ก็ได้
}
