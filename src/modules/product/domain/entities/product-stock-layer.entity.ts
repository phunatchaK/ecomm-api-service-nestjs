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

@Entity('product_stock_layers')
export class ProductStock {
  @PrimaryGeneratedColumn()
  layer_id: number;

  @ManyToOne(() => Product, (product) => product.stock_layers)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int' })
  available_qty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_cost: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
