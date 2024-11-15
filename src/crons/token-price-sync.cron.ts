import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { CronJob } from "cron";
import { PricesEntity } from "src/entities/price.entity";
import { CmcService } from "src/utils/cmc.client";
import { SupportedToken } from "src/utils/constant";
import { Repository } from "typeorm";

@Injectable()
export class TokenPriceSyncCron implements OnApplicationBootstrap {
  private isCronRunning = false;

  constructor(
    private cmcService: CmcService,
    @InjectRepository(PricesEntity)
    private readonly priceEntityRepo: Repository<PricesEntity>
  ) {}

  async onApplicationBootstrap() {
    console.log("OnApplicationBootstrap TOKEN PRICE SYNC");
    this.startCronJob().start();
  }

  startCronJob(): CronJob {
    return new CronJob(CronExpression.EVERY_5_MINUTES, async () => {
      if (!this.isCronRunning) {
        this.isCronRunning = true;
        try {
          for (const token of SupportedToken) {
            const currentPrice =
              await this.cmcService.getNatvieTokenPrice(token);
            const tokenPrice = await this.priceEntityRepo.findOne({
              where: {
                symbol: token,
              },
            });

            await this.priceEntityRepo.save({
              symbol: currentPrice.symbol,
              chain: currentPrice.name,
              price: currentPrice?.quote?.USD?.price,
              percentChange1h: currentPrice?.quote?.USD?.percent_change_1h,
              percentChange24h: currentPrice?.quote?.USD?.percent_change_24h,
              timestamp: new Date(), // `@CreateDateColumn` will automatically set this value
            });
          }
        } catch (error) {
          console.error("Error in Token Price Sync Cron Job:", error);
        } finally {
          this.isCronRunning = false; // Ensure the cron is marked as not running, even on failure
        }
      }
    });
  }
}
