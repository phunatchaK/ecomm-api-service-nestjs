import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { WarehouseController } from './modules/warehouse/interface/warehouse.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, databaseConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
      }),
    }),
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController, WarehouseController],
  providers: [AppService],
})
export class AppModule {}
