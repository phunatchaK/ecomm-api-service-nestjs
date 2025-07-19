import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';
import { ApiResponse, PaginationReponse } from 'src/common/dto/response.dto';
import { ProductService } from '../../application/services/product.service';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { StockMovementDto } from '../../application/dto/stock-movement.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(
    @Query() query: PaginationQueryDTO,
    @Query(`search`) search?: string,
    @Query(`order`) order?: string,
  ) {
    const [data, total] = await this.productService.getAllProdcuts(
      query.page,
      query.limit,
      search,
      order,
    );
    return ApiResponse.success(
      new PaginationReponse(data, total, query.limit, query.page),
      'Product list fetched successfully',
    );
  }

  @Get(`:productId`)
  async getProductById(@Param(`productId`, ParseIntPipe) productId: number) {
    const result = await this.productService.getProductById(productId);
    return ApiResponse.success(result, 'Product fetched successfully');
  }

  @Post()
  async createProduct(@Body() body: CreateProductDto) {
    const result = await this.productService.createProduct(body);
    return ApiResponse.success(result, 'Product created');
  }

  @Post(`updateStock`)
  async updateStockProduct(@Body() updateDto: StockMovementDto) {
    const result = await this.productService.updateStock(updateDto);
    return ApiResponse.success(result, 'Stock updated');
  }

  @Patch(':productId/deactivate')
  async deactivate(@Param(`productId`, ParseIntPipe) productId: number) {
    const result = await this.productService.deactivateProduct(productId);
    return ApiResponse.success(result, 'Product deactivated successfully');
  }
}
