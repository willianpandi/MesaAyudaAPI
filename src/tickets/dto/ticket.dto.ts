import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, } from "class-validator";
import { ESTADOS } from "src/constants/opcions";

export class TicketDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    descripcion: string;

    @ApiProperty()
    @IsOptional()
    archivo: Buffer;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    area: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    piso: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    n_sala: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    n_consultorio: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(ESTADOS)
    estado: ESTADOS;

}
export class UpdateTicketDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    descripcion: string;

    @ApiProperty()
    @IsOptional()
    archivo: Buffer;

    @ApiProperty()
    @IsOptional()
    @IsString()
    area: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    piso: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    n_sala: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    n_consultorio: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(ESTADOS)
    estado: ESTADOS;

}
