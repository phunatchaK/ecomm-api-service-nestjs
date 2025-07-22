import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './application/services/product.service';
import { ProductStock } from './domain/entities/product-stock.entity';
import { Product } from './domain/entities/product.entity';
import { StockMovementRepository } from './infrastructure/repositories/product-stock.repository';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { ProductController } from './presentation/controllers/product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductStock])],
  providers: [
    ProductService,
    { provide: 'IProductRepository', useClass: ProductRepository },
    { provide: 'IStockMovementRepository', useClass: StockMovementRepository },
  ],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
