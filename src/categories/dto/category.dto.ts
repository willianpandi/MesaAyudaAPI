import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  
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
  @IsString()
  descripcion: string;

}

export class UpdateCategoryDto extends PartialType(CategoryDto) {}
