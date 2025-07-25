import { Controller, Get, Query } from '@nestjs/common';
import { WarehouseService } from '../application/services/warehouse.service';
import { PaginationQueryDTO } from 'src/common/dto/pagination.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}
  @Get()
  async getWarehouseByCondition(@Query() query: PaginationQueryDTO, @Query('isActive') isActive?: boolean) {
    const [data, total] = await this.warehouseService.getWarehouseByCondition(
      query.page,
      query.limit,
      query.search,
      isActive
    );
    return;
  }
}
