import { WarehouseModel } from '../models/warehouse.model';
export interface IWarehouseRepository {
  findAllWarehouse(): Promise<WarehouseModel[]>;
  findWarehouseByWarehouseId(warehouseId: number): Promise<WarehouseModel | null>;
  findWarehouseByName(warehouseName: string): Promise<WarehouseModel | null>;
  findWarehouseByCondition(
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean
  ): Promise<[WarehouseModel[], number]>;
  createWarehouse(model: WarehouseModel): Promise<WarehouseModel>;
  updateWarehouse(model: WarehouseModel): Promise<WarehouseModel>;
  activeWarehouse(warehouseId: number): Promise<void>;
  deactivateWarehouse(warehouseId: number): Promise<void>;
  checkAvailableStock(warehouseId: number): Promise<boolean>;
  deleteWarehouse(warehouseId: number): Promise<void>; // มีไว้แต่ไม่ได้ใช้
}
