import { Module } from '@nestjs/common';
import { ProductService } from './application/services/product.service';
import { ProductController } from './presentation/controllers/product.controller';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { StockMovementRepository } from './infrastructure/repositories/product-stock.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entities/product.entity';
import { ProductStock } from './domain/entities/product-stock-layer.entity';

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
