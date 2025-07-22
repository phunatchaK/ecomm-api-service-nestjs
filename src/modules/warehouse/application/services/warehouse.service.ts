import { BadRequestException, Injectable } from '@nestjs/common';
import { WarehouseModel } from '../../domain/models/warehouse.model';
import { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { WarehouseFactory } from '../factories/warehouse.factories';

@Injectable()
export class WarehouseService {
  constructor(private readonly warehouseRepo: IWarehouseRepository) {}

  async getAllWarehouse(): Promise<WarehouseModel[]> {
    return this.warehouseRepo.findAllWarehouse();
  }

  async getWarehouseByWarehouseId(warehouseId: number): Promise<WarehouseModel> {
    const warehouse = await this.warehouseRepo.findWarehouseByWarehouseId(warehouseId);
    if (!warehouse) throw new BadRequestException('Warehouse not found ');
    return warehouse;
  }

  async createWarehouse(name: string, location: string): Promise<WarehouseModel> {
    const exist = await this.warehouseRepo.findWarehouseByName(name);
    if (exist) throw new BadRequestException('Warehouse Name has already exits');

    const warehouse = WarehouseFactory.createNewWarehouse(name, location);
    return this.warehouseRepo.createWarehouse(warehouse);
  }

  async;
}
