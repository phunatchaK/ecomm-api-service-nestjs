import { WarehouseModel } from '../../domain/models/warehouse.model';

export class WarehouseFactory {
  static createNewWarehouse(name: string, location: string): WarehouseModel {
    if (!name || !location) throw new Error('Name and Location are required');
    return new WarehouseModel(0, name, location, true, new Date(), new Date());
  }
}
