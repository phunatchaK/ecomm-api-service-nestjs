import { Module } from '@nestjs/common';
import { ProductService } from './application/services/product/product.service';
import { ProductController } from './presentation/controllers/product/product.controller';

@Module({
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
