import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { EstableishmentsModule } from './estableishments/estableishments.module';
import { DistrictsModule } from './districts/districts.module';
import { TicketsModule } from './tickets/tickets.module';
import { DirectivesModule } from './directives/directives.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'ejemplo_1',
      username: 'postgres',
      password: '150820',
      autoLoadEntities: true,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule, 
    EstableishmentsModule, 
    DistrictsModule, 
    TicketsModule, 
    DirectivesModule, 
    AuthModule, 
  ],
})
export class AppModule { }
