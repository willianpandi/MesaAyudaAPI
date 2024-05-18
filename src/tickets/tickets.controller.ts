import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { ESTADOS, ROLES } from '../constants/opcions';
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
  ) {
    return await this.ticketsService.createTicket(body, file);
  }
  
  @Post('create-ticket')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async createTicket(
    @Body() body: TicketDto,
  ) {
    return await this.ticketsService.createTicketBySupport(body);
  }

  @Get('all')
  @Auth(ROLES.ADMINISTRADOR)
  async findAll(@Query('inicio') inicio: string, @Query('fin') fin: string) {
    return await this.ticketsService.findAllTickets(inicio, fin);
  }
  
  @Get('tickets/:id')
  async findTickets(@Param('id') id: string) {
    return await this.ticketsService.findTickets(id);
  }
 

  @Get('reasig-tickets')
  @Auth(ROLES.SOPORTE)
  async findTicketsAsigNew(@GetUser() user: User) {
    const tickets = await this.ticketsService.findAllTicketsAsig(user);
    const newTicketsAsig = tickets.filter(ticket => ticket.estado === ESTADOS.ABIERTO || ticket.estado === ESTADOS.EN_PROCESO);
    return newTicketsAsig;
  }
  
  @Get('reasig-close-tickets')
  @Auth(ROLES.SOPORTE)
  async findTicketsAsigClose(@GetUser() user: User) {
    const tickets = await this.ticketsService.findAllTicketsAsig(user);
    const closeTicketsAsig = tickets.filter(ticket => ticket.estado === ESTADOS.CERRADO);
    return closeTicketsAsig;
  }
 
  @Get('reports')
  @Auth(ROLES.ADMINISTRADOR)
  async findTicketsReports(@Query('mes') mes: number, @Query('anio') anio: number) {
      return await this.ticketsService.findAllTicketsReasig(mes, anio);
  }

  @Get('count')
  async getCount() {
    return await this.ticketsService.Count();
  }

  @Get(':id')
  // @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.ticketsService.findOneTicket(id);
  }
  
  @Get('search/:id')
  async findOneSeacrh(@Param('id') id: string) {
    const tickets = await this.ticketsService.searchTickets(id);
    const firstClosedTicket = tickets.find(ticket => ticket.estado === ESTADOS.CERRADO);
    const resultTicket = firstClosedTicket || tickets[0];
    if (!resultTicket) {
      throw new BadRequestException('No se encontró ningún ticket.');
    }
    return resultTicket;
  }

  @Patch('edit/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTicketDto,
  ) {
    return await this.ticketsService.updateTicket(id, body);
  }
  
  @Patch('edit-departamento/:id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async updateDepartamento(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTicketDto,
  ) {
    return await this.ticketsService.updateDepartTicket(id, body);
  }

  @Patch('edit-close/:id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async updateCloseTicket(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTicketDto,
  ) {
    return await this.ticketsService.updateCloseTicket(id, body);
  }

  @Patch('edit-reasig/:id')
  @Auth(ROLES.SOPORTE, ROLES.ADMINISTRADOR)
  async updateAsigTicket(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTicketDto,
  ) {
    return await this.ticketsService.updateReasigTicket(id, body);
  }

  // SUBIR ARCHIVOS

  @Get('file/:fileName')
  findFile(@Res() res: Response, @Param('fileName') fileName: string) {
    const path = this.ticketsService.getFileName(fileName);
    res.sendFile(path);
  }


  //LOGO
  @Post('logo')
  @Auth(ROLES.ADMINISTRADOR)
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
