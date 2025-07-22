import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { WarehouseEntity } from 'src/modules/warehouse/domain/entities/warehouse.entity';
import { join } from 'path';

@Entity('product_stock')
export class ProductStock {
  @PrimaryGeneratedColumn()
  stock_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int' })
  available_qty: number;

  @ManyToOne(() => WarehouseEntity)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: WarehouseEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_cost: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
