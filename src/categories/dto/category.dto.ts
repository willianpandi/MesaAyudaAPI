import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
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
