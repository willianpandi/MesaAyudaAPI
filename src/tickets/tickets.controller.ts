import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketDetalleDto, TicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { ROLES } from '../constants/opcions';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileFilterImage } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';
import { LogoNamer } from './helpers/LogoNamer.helper';
import { existsSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './uploads/files',
        filename: fileNamer,
      }),
    }),
  )
  async create(
    @Body() body: TicketDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return await this.ticketsService.createTicket(body, file, user);
  }

  @Get('all')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findAll(@GetUser() user: User) {
    return await this.ticketsService.findAllTickets(user);
  }

  //CONTADOR
  @Get('count')
  async getCount() {
    return await this.ticketsService.Count();
  }

  @Get(':id')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.ticketsService.findOneTicket(id);
  }

  @Patch('edit/:id')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTicketDto,
  ) {
    return await this.ticketsService.updateTicket(id, body);
  }

  @Delete('delete/:id')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.ticketsService.removeTicket(id);
  }


  @Get('detalle/:id')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findOneDetalle(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.ticketsService.detalles(id);
  }

  @Post('create/detalle/:id')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async createDetalle(
    @Body() body: TicketDetalleDto,
    @Param('id', new ParseUUIDPipe()) id: string
    // @GetUser() user: User,
  ) {
    return await this.ticketsService.saveDetalle(id, body);
  }

  //CONTROLADORES PARA SUBIR ARCHIVOS

  @Post('files/:id')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: {fileSize: 1000},
      storage: diskStorage({
        destination: './uploads',
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.ticketsService.createFile(file, id);
  }

  @Get('file/:fileName')
  findFile(@Res() res: Response, @Param('fileName') fileName: string) {
    const path = this.ticketsService.getFileName(fileName);
    res.sendFile(path);
  }

  @Get('files/:id')
  @Auth(ROLES.USUARIO, ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findAllFile(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.ticketsService.getFiles(id);
  }

  //Logo
  @Post('logo')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilterImage,
      storage: diskStorage({
        destination: './uploads/logo',
        filename: LogoNamer,
      }),
    }),
  )
  uploadLogo(@UploadedFile() file: Express.Multer.File) {

      if (!file) {
        throw new BadRequestException('No se proporcionó un archivo');
      }
  
      const secureUrl = `${this.configService.get('HOST_API')}/tickets/logo/${file.filename}`;
      return {ok: true};
    
  }

  @Get('logo/:fileName')
  findLogo(
    @Res() res: Response, 
    @Param('fileName') fileName: string
  ) {
    const path = join(__dirname, '../../uploads/logo/', fileName);

    if (existsSync(path)) {
      res.sendFile(path);
      // return path;
    } else {
      const path = join(__dirname, '../../uploads/logo/no-image.png');
      res.sendFile(path);
      // return path;
    }
  }
}
