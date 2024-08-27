import { Type } from "class-transformer";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

export class BookCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  price: number;
}

export class BookUpdateDto extends PartialType(BookCreateDto) {}

export class BookViewDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}
export class QueryParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  searchKeyword: string;

  @ApiProperty({ default: 1 }) // Set default value for page
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ default: 10 }) // Set default value for limit
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  limit: number = 10;
}
