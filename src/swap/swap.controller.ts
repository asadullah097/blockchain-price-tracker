import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { SwapService } from "./swap.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SwapRateResponseDto } from "./swap.dto";

@Controller("swap")
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get("rate")
  @ApiOperation({ summary: "Get swap rate from ETH to BTC" })
  @ApiResponse({
    status: 200,
    description: "Swap rate calculated successfully.",
    type: SwapRateResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid ETH amount provided." })
  async getSwapRate(@Query("ethAmount") ethAmount: string) {
    const eth = parseFloat(ethAmount);
    if (isNaN(eth) || eth <= 0) {
      throw new BadRequestException("Invalid ETH amount");
    }
    return this.swapService.getSwapRate(eth);
  }
}
