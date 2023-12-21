import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DirectiveDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  rango_tiempo: string;
}

export class UpdateDirectiveDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  descripcion: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  rango_tiempo: string;
}
