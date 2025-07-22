import { DataSource, Repository } from 'typeorm';
import { WarehouseEntity } from '../../domain/entities/warehouse.entity';
import { WarehouseModel } from '../../domain/models/warehouse.model';
import { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { WarehouseMapper } from '../mappers/warehouse.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ProductStock } from 'src/modules/product/domain/entities/product-stock.entity';

@Injectable()
export class WarehouseRepository implements IWarehouseRepository {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
    private readonly dataSource: DataSource
  ) {}

  async findAllWarehouse(): Promise<WarehouseModel[]> {
    const result = await this.warehouseRepo.find({ where: { is_active: true } });
    return result.map((r) => WarehouseMapper.toModel(r));
  }

  async findWarehouseByWarehouseId(warehouseId: number): Promise<WarehouseModel | null> {
    const result = await this.warehouseRepo.findOne({ where: { warehouse_id: warehouseId } });
    return result ? WarehouseMapper.toModel(result) : null;
  }

  async findWarehouseByName(warehouseName: string): Promise<WarehouseModel | null> {
    const result = await this.warehouseRepo.findOne({ where: { name: warehouseName } });
    return result ? WarehouseMapper.toModel(result) : null;
  }

  async findWarehouseByCondition(condition: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<[WarehouseModel[], number]> {
    const qb = this.warehouseRepo.createQueryBuilder('w');
    if (condition.search) {
      qb.andWhere(`w.name ILIKE :search OR w.location ILIKE :search`, { search: condition.search });
    }

    qb.andWhere(`w.is_active = true`);

    qb.skip((condition.page - 1) * condition.limit);
    qb.limit(condition.limit);

    const [entity, total] = await qb.getManyAndCount();
    return [entity.map(WarehouseMapper.toModel), total];
  }

  async createWarehouse(warehouseModel: WarehouseModel): Promise<WarehouseModel> {
    const entity = WarehouseMapper.toEntity(warehouseModel);
    const save = await this.warehouseRepo.save(entity);
    return WarehouseMapper.toModel(save);
  }

  async udpateWarehouse(warehouseModel: WarehouseModel): Promise<WarehouseModel> {
    const entity = WarehouseMapper.toEntity(warehouseModel);
    const update = await this.warehouseRepo.save(entity);
    return WarehouseMapper.toModel(update);
  }

  async checkAvailableStock(warehouseId: number): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(ProductStock)
      .createQueryBuilder('wh')
      .where(`wh.warehouse_id = :warehouseId`, { warehouseId: warehouseId })
      .getCount();

    return result > 0;
  }
  async deactivateWarehouse(warehouseId: number): Promise<void> {
    await this.warehouseRepo.update({ warehouse_id: warehouseId }, { is_active: false });
  }

  async activeWarehouse(warehouseId: number): Promise<void> {
    await this.warehouseRepo.update({ warehouse_id: warehouseId }, { is_active: true });
  }

  // ไม่ได้ใช้
  async deleteWarehouse(warehouseId: number): Promise<void> {
    await this.warehouseRepo.delete({ warehouse_id: warehouseId });
  }
}
