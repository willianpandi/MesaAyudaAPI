import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmpty, IsString } from "class-validator";

export class CreateFileDto {
    @ApiProperty()
    @IsEmpty()
    @IsString()
    archivo: string;
}

export class UodateFileDto extends PartialType(CreateFileDto){}
