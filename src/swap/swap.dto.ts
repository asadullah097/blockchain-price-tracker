// src/swap/dto/swap-rate-response.dto.ts

import { ApiProperty } from "@nestjs/swagger";

class FeeDto {
  @ApiProperty({ description: "Fee in ETH" })
  eth: number;

  @ApiProperty({ description: "Fee in USD" })
  dollar: number;
}

export class SwapRateResponseDto {
  @ApiProperty({ description: "Amount of BTC received for the given ETH" })
  btcAmount: number;

  @ApiProperty({ description: "Total fee for the swap" })
  fee: FeeDto;
}
