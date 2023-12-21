import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { EstableishmentsModule } from './estableishments/estableishments.module';
import { DistrictsModule } from './districts/districts.module';
import { TicketsModule } from './tickets/tickets.module';
import { DirectivesModule } from './directives/directives.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SarveyModule } from './sarvey/sarvey.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '150820',
      database: 'ejemplo_1',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule, 
    EstableishmentsModule, 
    DistrictsModule, 
    TicketsModule, 
    DirectivesModule, 
    SarveyModule],
})
export class AppModule { }
