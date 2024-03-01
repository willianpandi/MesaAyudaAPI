import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubCategoryDto {
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
