import { ESTADOS } from './../../constants/opcions';
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, } from "class-validator";
import { Directive } from '../../directives/entities/directive.entity';
import { File } from '../entities/file.entity';


export class TicketDto {

    @ApiProperty()
    @IsNotEmpty()
    directive: Directive;

    @ApiProperty()
    @IsNotEmpty()
    soporteUser: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    descripcion: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    titulo: string;

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
    @IsOptional()
    files?: File[];

}


export class UpdateTicketDto extends PartialType(TicketDto){}

export class TicketDetalleDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    detalle: string;
}

// export class UpdateTicketDto {

//     @ApiProperty()
//     @IsNotEmpty()
//     directive: Directive;


//     @ApiProperty()
//     @IsOptional()
//     @IsString()
//     descripcion: string;

//     @ApiProperty()
//     @IsOptional()
//     @IsString()
//     titulo: string;

//     @ApiProperty()
//     @IsNotEmpty()
//     @IsString()
//     area: string;

//     @ApiProperty()
//     @IsNotEmpty()
//     @IsString()
//     piso: string;

//     @ApiProperty()
//     @IsNotEmpty()
//     @IsString()
//     n_sala: string;

//     @ApiProperty()
//     @IsNotEmpty()
//     @IsString()
//     n_consultorio: string;

//     @ApiProperty()
//     @IsOptional()
//     @IsEnum(ESTADOS)
//     estado?: ESTADOS;
    
//     @ApiProperty()
//     @IsOptional()
//     files?: File[];

// }