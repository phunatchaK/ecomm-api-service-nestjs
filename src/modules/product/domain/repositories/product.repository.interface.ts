import { Product } from '../entities/product.entity';

export interface IProductRepository {
  findAllProducts(
    page: number,
    limit: number,
    search?: string,
    sort?: string,
  ): Promise<[Product[], number]>;
  findProductById(prodId: number): Promise<Product | null>;
  findProductBySku(sku: string): Promise<Product | null>;
  createOrEditProduct(product: Partial<Product>): Promise<Product>;
  updateStock(productId: number, qty: number): Promise<void>;
  editProduct(
    productId: number,
    payload: Partial<Product>,
  ): Promise<Product | null>;
  deactivateProduct(productId: number): Promise<void>;
}
