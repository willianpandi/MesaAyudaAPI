import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EstableishmentsModule } from './estableishments/estableishments.module';
import { DistrictsModule } from './districts/districts.module';
import { TicketsModule } from './tickets/tickets.module';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SubCategoryModule } from './sub-category/sub-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule, 
    EstableishmentsModule, 
    DistrictsModule, 
    TicketsModule, 
    CategoriesModule, 
    AuthModule, 
    SubCategoryModule, 
  ],
})
export class AppModule { }
