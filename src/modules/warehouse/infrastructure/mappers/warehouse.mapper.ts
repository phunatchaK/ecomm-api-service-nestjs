import { WarehouseEntity } from '../../domain/entities/warehouse.entity';
import { WarehouseModel } from '../../domain/models/warehouse.model';

export class WarehouseMapper {
  static toModel(warehouseEntity: WarehouseEntity): WarehouseModel {
    return new WarehouseModel(
      warehouseEntity.warehouse_id,
      warehouseEntity.name,
      warehouseEntity.location!,
      warehouseEntity.is_active,
      warehouseEntity.created_at,
      warehouseEntity.updated_at
    );
  }

  static toEntity(model: WarehouseModel): WarehouseEntity {
    const entity = new WarehouseEntity();
    entity.warehouse_id = model.getWarehouseId();
    entity.name = model.getName();
    entity.location = model.getLocation();
    entity.created_at = model.getCreatedAt();
    entity.updated_at = model.getUpdatedAt();
    return entity;
  }
}
