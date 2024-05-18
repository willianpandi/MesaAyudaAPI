import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubCategoryDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  estado: boolean;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tiempo: number;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  category: string;
}

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}
