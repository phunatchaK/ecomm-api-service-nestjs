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
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { StockMovementDto } from '../../application/dto/stock-movement.dto';
import { UpdateProductDto } from '../../application/dto/update-product.dto';
import { ProductService } from '../../application/services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(
    @Query() query: PaginationQueryDTO,
    @Query(`search`) search?: string,
    @Query(`order`) order?: string,
  ) {
    const [data, total] = await this.productService.getAllProducts(
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

  @Patch(':productId')
  async updateProductDetialByProductId(
    @Param('productId', ParseIntPipe) prodId: number,
    @Body() body: UpdateProductDto,
  ) {
    const result = await this.productService.editProductdetailByProductId(
      prodId,
      body,
    );
    return ApiResponse.success(result, `Product updated successfully`);
  }

  @Post(`:productId/updateStock`)
  async createStockProduct(@Body() updateDto: StockMovementDto) {
    const result = await this.productService.updateStock(updateDto);
    return ApiResponse.success(result, 'Stock updated');
  }
}
