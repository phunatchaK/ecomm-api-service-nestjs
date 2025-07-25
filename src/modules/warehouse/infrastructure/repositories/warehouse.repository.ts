import { DataSource, Repository } from 'typeorm';
import { WarehouseEntity } from '../../domain/entities/warehouse.entity';
import { WarehouseModel } from '../../domain/models/warehouse.model';
import { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { WarehouseMapper } from '../mappers/warehouse.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ProductStock } from 'src/modules/product/domain/entities/product-stock.entity';
import { applyPaginationAndSorting } from 'src/common/helpers/pagination.helper';

@Injectable()
export class WarehouseRepository implements IWarehouseRepository {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepo: Repository<WarehouseEntity>,
    private readonly dataSource: DataSource
  ) {}

  async findAllWarehouse(): Promise<WarehouseModel[]> {
    const result = await this.warehouseRepo.find({ where: { is_active: true } });
    return WarehouseMapper.toModels(result);
  }

  async findWarehouseByWarehouseId(warehouseId: number): Promise<WarehouseModel | null> {
    const result = await this.warehouseRepo.findOne({ where: { warehouse_id: warehouseId } });
    return result ? WarehouseMapper.toModel(result) : null;
  }

  async findWarehouseByName(warehouseName: string): Promise<WarehouseModel | null> {
    const result = await this.warehouseRepo.findOne({ where: { name: warehouseName } });
    return result ? WarehouseMapper.toModel(result) : null;
  }

  async findWarehouseByCondition(
    page: number,
    limit: number,
    search?: string,
    isActive: boolean = true
  ): Promise<[WarehouseModel[], number]> {
    const qb = this.warehouseRepo.createQueryBuilder('w').where(`w.is_active = :isActive`, { isActive: isActive });

    if (search) qb.andWhere(`(w.name ILIKE :search OR w.location ILIKE :search)`, { search: `%${search}%` });

    applyPaginationAndSorting(qb, page, limit, 'w.created_at:desc');

    const [entity, total] = await qb.getManyAndCount();
    return [WarehouseMapper.toModels(entity), total];
  }

  async createWarehouse(warehouseModel: WarehouseModel): Promise<WarehouseModel> {
    const entity = WarehouseMapper.toEntity(warehouseModel);
    const save = await this.warehouseRepo.save(entity);
    return WarehouseMapper.toModel(save);
  }

  async updateWarehouse(warehouseModel: WarehouseModel): Promise<WarehouseModel> {
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
