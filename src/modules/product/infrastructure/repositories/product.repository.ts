import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { NotFoundException } from '@nestjs/common';

export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAllProducts(
    page: number,
    limit: number,
    search: string,
    sort: string,
  ): Promise<[Product[], number]> {
    const qb = this.productRepo.createQueryBuilder('p');

    if (search) {
      qb.where(`p.name ILIKE :search OR p.sku ILIKE :search`, {
        search: `%${search}%`,
      });
    }

    if (sort) {
      const [field, order] = sort.split('_');
      const validFields = ['price', 'name', 'created_at'];
      if (validFields.includes(field)) {
        qb.orderBy(`p.${field}`, order.toUpperCase() as 'ASC' | 'DESC');
      }
    } else {
      qb.orderBy('p.created_at', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount();
  }

  async findProductById(prodId: number): Promise<Product | null> {
    return this.productRepo.findOne({ where: { product_id: prodId } });
  }

  async createOrEditProduct(product: Partial<Product>): Promise<Product> {
    const payload = this.productRepo.create(product);
    return this.productRepo.save(payload);
  }

  async updateStock(productId: number, qty: number): Promise<void> {
    await this.productRepo
      .createQueryBuilder()
      .update(Product)
      .set({ stock_qty: () => `stock_qty + ${qty}` })
      .where(`product_id = ${productId}`)
      .execute();
  }

  async findProductBySku(sku: string): Promise<Product | null> {
    return this.productRepo.findOne({ where: { sku } });
  }

  // async findProductByIdOrFail(productId: number): Promise<Product> {
  //   const product = await this.productRepo.findOne({
  //     where: { product_id: productId },
  //   });
  //   if (!product) throw new NotFoundException('Product not found ');
  //   return product;
  // }

  async editProduct(
    productId: number,
    payload: Partial<Product>,
  ): Promise<Product | null> {
    await this.productRepo.update(productId, payload);
    return this.findProductById(productId);
  }

  async deactivateProduct(productId: number): Promise<void> {
    await this.productRepo
      .createQueryBuilder()
      .update(Product)
      .set({ is_active: false })
      .where(`product_id = :productId`, { productId })
      .execute();
  }
}
