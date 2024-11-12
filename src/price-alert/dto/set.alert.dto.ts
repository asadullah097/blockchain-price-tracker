// src/price-alert/dto/create-price-alert.dto.ts

import {
  IsString,
  IsEmail,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePriceAlertDto {
  @ApiProperty({
    description: "The name of the chain (e.g., Bitcoin, Ethereum)",
    example: "Bitcoin",
  })
  @IsString()
  @IsNotEmpty()
  chain: string; // The chain (e.g., Bitcoin, Ethereum)

  @ApiProperty({
    description: "The target price at which to trigger the alert",
    example: 50000.0,
    type: "number",
  })
  @IsNumber()
  @IsNotEmpty()
  price: number; // Target price for the alert

  @ApiProperty({
    description: "The email address to send the alert to",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string; // Email address to send the alert to
}
