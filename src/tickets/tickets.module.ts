import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

import { Ticket } from './entities/ticket.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';

import { CategoriesService } from '../categories/categories.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { File } from './entities/file.entity';
import { UsersModule } from '../users/users.module';
import { SubCategoryService } from '../sub-category/sub-category.service';
import { SubCategory } from '../sub-category/entities/sub-category.entity';
import { EstableishmentsService } from '../estableishments/estableishments.service';
import { DistrictsService } from '../districts/districts.service';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      Category,
      User,
      SubCategory,
      File,
    ]),
    UsersModule,
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,  
          pass: process.env.MAIL_PASS,
        },
        // service: 'gmail',
        // auth: {
        //   user: process.env.MAIL_USER,
        //   pass: process.env.MAIL_PASS,
        // },
      },
      defaults: {
        from: '"Mesa de Ayuda" <noreply@example.com>',
      },
    }),
  ],
  controllers: [TicketsController],
  providers: [TicketsService, CategoriesService, SubCategoryService, EstableishmentsService, DistrictsService, ConfigService],
  exports: [TicketsService, TypeOrmModule,],
})
export class TicketsModule {}
