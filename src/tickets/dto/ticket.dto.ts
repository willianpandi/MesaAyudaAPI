import { ESTADOS, OPORTUNO, SATISFACCION, S_PROBLEMA } from './../../constants/opcions';
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, } from "class-validator";
import { File } from '../entities/file.entity';

export class TicketDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    cedula: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    correo_electronico: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    telefono: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    requerimiento: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    area: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    piso?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    n_sala?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    n_consultorio?: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(ESTADOS)
    estado?: ESTADOS;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    subcategory: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    estableishment: string;
    
    @ApiProperty()
    @IsOptional()
    file?: File;

    @ApiProperty()
    @IsOptional()
    @IsEnum(SATISFACCION)
    satisfaccion?: SATISFACCION;
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(OPORTUNO)
    a_oportuna?: OPORTUNO;
    
    @ApiProperty()
    @IsOptional()
    @IsEnum(S_PROBLEMA)
    s_problema?: S_PROBLEMA;

    @ApiProperty()
    @IsOptional()
    @IsString()
    sugerencias?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    soporteReasignado?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    soporteAsignado?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsDate()
    reasignadoAt?: Date;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    soportePresente?: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    tiempoOcupado?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    tiempoReasignado?: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    soporteComentario?: string;

}


export class UpdateTicketDto extends PartialType(TicketDto){}