import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductStock } from '../../domain/entities/product-stock.entity';
import { IStockMovementRepository } from '../../domain/repositories/product-stock.repository.interface';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { StockMovementDto, StockMovementType } from '../dto/stock-movement.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepo: IProductRepository,
    @Inject('IStockMovementRepository')
    private readonly stockMoveRepo: IStockMovementRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getAllProducts(
    page: number,
    limit: number,
    search?: string,
    sort?: string,
  ) {
    return this.productRepo.findAllProducts(page, limit, search, sort);
  }

  async getProductById(productId: number) {
    const product = this.productRepo.findProductById(productId);
    if (!product) throw new BadRequestException('Product not found');
    return product;
  }

  async createProduct(createDto: CreateProductDto) {
    const exist = await this.productRepo.findProductBySku(createDto.sku);
    if (exist) throw new BadRequestException('Product has exist');
    return this.productRepo.createOrEditProduct(createDto);
  }

  async editProductdetailByProductId(
    productId: number,
    updateDto: UpdateProductDto,
  ) {
    const product = await this.productRepo.findProductById(productId);
    if (!product) throw new BadRequestException('Product not found');

    if (updateDto.sku && updateDto.sku !== product.sku) {
      const skuExist = await this.productRepo.findProductBySku(updateDto.sku);
      if (skuExist) throw new BadRequestException('Sku already exitss');
    }

    return this.productRepo.createOrEditProduct({
      ...product,
      ...updateDto,
      product_id: productId,
    });
  }

  async updateStock(updateDto: StockMovementDto) {
    if (updateDto.movement_type === StockMovementType.PURCHASE_IN) {
      return this.purchaseIn(
        updateDto.productId,
        updateDto.quantity,
        updateDto.unit_cost,
      );
    } else if (updateDto.movement_type === StockMovementType.PURCHASE_OUT) {
      return this.purchaseOut(updateDto.productId, updateDto.quantity);
    } else {
      throw new BadRequestException('Invalid stock movement type');
    }
  }

  private async purchaseIn(productId: number, qty: number, cost: number) {
    return this.dataSource.transaction(async () => {
      await this.stockMoveRepo.createStock(productId, qty, cost);
      await this.productRepo.updateStock(productId, qty);
      return { productId, qty, cost };
    });
  }

  private async purchaseOut(productId: number, qty: number) {
    return this.dataSource.transaction(async () => {
      let remainQty = qty;
      const fifos = await this.stockMoveRepo.getFifo(productId);

      const fifoToUpdate: ProductStock[] = [];

      for (const fifo of fifos) {
        if (remainQty <= 0) break;
        const reduceQty = Math.min(remainQty, fifo.available_qty);

        fifo.available_qty -= reduceQty;
        remainQty -= reduceQty;

        fifoToUpdate.push(fifo);
      }

      if (remainQty > 0) throw new BadRequestException('Insufficient stock');

      await this.stockMoveRepo.bulkUpdateStock(fifoToUpdate);

      await this.productRepo.updateStock(productId, -qty);

      return { productId, qty };
    });
  }
}
