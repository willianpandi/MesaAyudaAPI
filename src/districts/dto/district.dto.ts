import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PROVINCIAS } from "../../constants/opcions";

export class DistrictDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    estado: boolean;
   
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    codigo: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(PROVINCIAS)
    provincia: PROVINCIAS;
}
export class UpdateDistrictDto extends PartialType(DistrictDto) {}
