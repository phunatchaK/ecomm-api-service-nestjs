import { ProductStock } from '../entities/product-stock.entity';

export interface IStockMovementRepository {
  getFifo(productId: number): Promise<ProductStock[]>;
  createStock(
    productId: number,
    qty: number,
    cost: number,
  ): Promise<ProductStock>;
  bulkUpdateStock(prodStock: ProductStock[]): Promise<void>;
}
