import { BadRequestException, Injectable } from '@nestjs/common';
import { WarehouseModel } from '../../domain/models/warehouse.model';
import { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { WarehouseFactory } from '../factories/warehouse.factory';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(private readonly warehouseRepo: IWarehouseRepository) {}

  async getAllWarehouse() {
    return this.warehouseRepo.findAllWarehouse();
  }

  async getWarehouseByWarehouseId(warehouseId: number): Promise<WarehouseModel> {
    const warehouse = await this.warehouseRepo.findWarehouseByWarehouseId(warehouseId);
    if (!warehouse) throw new BadRequestException(`Warehouse with id ${warehouseId} not found`);
    return warehouse;
  }

  async getWarehouseByCondition(page: number, limit: number, search?: string, isActive?: boolean) {
    const [data, total] = await this.warehouseRepo.findWarehouseByCondition(page, limit, search, isActive);
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async createWarehouse(createWarehouseDto: CreateWarehouseDto): Promise<WarehouseModel> {
    const { name, location } = createWarehouseDto;
    const exist = await this.warehouseRepo.findWarehouseByName(name);
    if (exist) throw new BadRequestException('Warehouse name already exist');

    const newWarehouse = WarehouseFactory.createNewWarehouse(name, location!);
    return this.warehouseRepo.createWarehouse(newWarehouse);
  }

  async updateWarehouse(warehouseId: number, updateWarehouseDto: UpdateWarehouseDto): Promise<WarehouseModel> {
    const { name, location } = updateWarehouseDto;
    const warehouse = await this.getWarehouseByWarehouseId(warehouseId);

    if (!warehouse) throw new BadRequestException(`Warehouse id ${warehouseId} not found `);

    if (name) {
      const nameExist = await this.warehouseRepo.findWarehouseByName(name);
      if (nameExist && nameExist.getWarehouseId() !== warehouseId) {
        throw new BadRequestException('Warehouse name already exists');
      }
      warehouse.changeName(name);
    }

    if (location) warehouse.changeLocation(location);
    return this.warehouseRepo.updateWarehouse(warehouse);
  }

  async deactivateWarehouse(warehouseId: number) {
    const warehouse = await this.getWarehouseByWarehouseId(warehouseId);
    const hasStock = await this.warehouseRepo.checkAvailableStock(warehouseId);
    if (hasStock) throw new BadRequestException('Cannot deactivate warehouse with existing stock');
    warehouse.deactivate();
    await this.warehouseRepo.deactivateWarehouse(warehouseId);
    return { success: true };
  }

  async activateWarehouse(warehouseId: number) {
    const warehouse = await this.getWarehouseByWarehouseId(warehouseId);
    warehouse.activate();
    await this.warehouseRepo.activeWarehouse(warehouseId);
    return { success: true };
  }

  // ไม่ได้ใช้แต่มีไว้เผื่อใช้
  async deleteWarehouse(warehouseId: number) {
    const hasStock = await this.warehouseRepo.checkAvailableStock(warehouseId);
    if (hasStock) throw new BadRequestException('Cannot delete warehouse with existing stock');
    await this.warehouseRepo.deleteWarehouse(warehouseId);
    return { success: true };
  }
}
