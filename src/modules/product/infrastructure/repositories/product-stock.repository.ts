import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductStock } from '../../domain/entities/product-stock.entity';
import { IStockMovementRepository } from '../../domain/repositories/product-stock.repository.interface';

@Injectable()
export class StockMovementRepository implements IStockMovementRepository {
  constructor(
    @InjectRepository(ProductStock)
    private readonly stockRepo: Repository<ProductStock>,
  ) {}

  async getFifo(productId: number): Promise<ProductStock[]> {
    return this.stockRepo
      .createQueryBuilder('stk')
      .where(`stk.product_id = :productId`, { productId })
      .andWhere('stk.avavailable_qty > 0')
      .orderBy('stk.create_at', 'ASC')
      .getMany();
  }

  async createStock(
    productId: number,
    qty: number,
    cost: number,
  ): Promise<ProductStock> {
    const payload = await this.stockRepo.create({
      product: { product_id: productId },
      available_qty: qty,
      unit_cost: cost,
    });
    return this.stockRepo.save(payload);
  }

  async bulkUpdateStock(prodStock: ProductStock[]): Promise<void> {
    await this.stockRepo.save(prodStock);
  }
}
