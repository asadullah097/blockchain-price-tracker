import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PricesEntity } from "src/entities/price.entity";
import { CmcService } from "src/utils/cmc.client";
import { Repository } from "typeorm";

@Injectable()
export class SwapService {
  constructor(
    private readonly cmcService: CmcService,
    @InjectRepository(PricesEntity)
    private readonly priceEntityRepo: Repository<PricesEntity>
  ) {}
  private readonly feePercentage = 0.03;

  async getSwapRate(ethAmount: number) {
    // Fetch the ETH to BTC exchange rate from an external API
    const btcRate = await this.fetchEthToBtcRate();

    if (!btcRate) {
      throw new HttpException(
        "Could not retrieve exchange rate",
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
    const ethAmountInDollar = await this.convertEthToDollar(ethAmount);

    // Calculate BTC amount and fees
    const btcAmount = ethAmount * (ethAmountInDollar / btcRate);
    const feeInEth = ethAmount * (this.feePercentage / 100);
    const feeInDollar = await this.convertEthToDollar(feeInEth);

    return {
      btcAmount,
      fee: {
        eth: feeInEth,
        dollar: feeInDollar,
      },
    };
  }

  private async fetchEthToBtcRate(): Promise<number> {
    try {
      const btcPrice = await this.cmcService.getNatvieTokenPrice("BTC");
      return btcPrice?.quote?.USD?.price;
    } catch (error) {
      throw new HttpException(
        "Failed to fetch exchange rate",
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  private async convertEthToDollar(ethAmount: number): Promise<number> {
    try {
      // Assuming the database has the ETH price in USD
      const tokenPrice = await this.priceEntityRepo.findOne({
        where: { symbol: "ETH" },
      });
      return ethAmount * (tokenPrice?.price || 0);
    } catch (error) {
      throw new HttpException(
        "Failed to fetch ETH to USD rate",
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}
