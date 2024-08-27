import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseData {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "book 1" })
  name: string;

  @ApiProperty({ example: "test description" })
  description: string;

  @ApiProperty({ example: 11 })
  price: number;

  @ApiProperty({ format: "date-time", example: "2024-27-08T00:00:00.000Z" })
  createdAt: string;

  @ApiProperty({ format: "date-time", example: "2024-27-08T00:00:00.000Z" })
  updatedAt: string;
}

export class ApiResponse {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: "Success" })
  message: string;

  @ApiProperty({ example: false })
  displayMessage: boolean;
}

export class MultipleBooksResponse extends ApiResponse {
  @ApiProperty({ type: [ApiResponseData] })
  data: ApiResponseData[];
}
export class SingleBookResponse extends ApiResponse {
  @ApiProperty({ type: ApiResponseData })
  data: ApiResponseData;
}
