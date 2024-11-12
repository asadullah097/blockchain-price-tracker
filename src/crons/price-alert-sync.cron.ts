import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { CronJob } from "cron";
import { CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { PricesEntity } from "src/entities/price.entity";
import { EmailService } from "src/utils/email.service";

@Injectable()
export class AlertSyncCron implements OnApplicationBootstrap {
  private isCronRunning = false;

  constructor(
    @InjectRepository(PricesEntity)
    private readonly pricesRepository: Repository<PricesEntity>,
    private readonly emailService: EmailService // Inject an email service
  ) {}

  async onApplicationBootstrap() {
    console.log("OnApplicationBootstrap ALERT SYNC");
    this.startCronJob().start();
  }

  startCronJob(): CronJob {
    return new CronJob(CronExpression.EVERY_HOUR, async () => {
      if (!this.isCronRunning) {
        this.isCronRunning = true;

        try {
          await this.checkPriceIncreases();
        } catch (error) {
          console.error("Error in Alert Sync Cron Job:", error);
        } finally {
          this.isCronRunning = false;
        }
      }
    });
  }

  private async checkPriceIncreases() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Fetch the prices of all chains
    const prices = await this.pricesRepository.find();

    for (const price of prices) {
      // Fetch the price from one hour ago for the same chain
      const priceOneHourAgo = await this.pricesRepository.findOne({
        where: {
          chain: price.chain,
          timestamp: MoreThan(oneHourAgo), // You may need to adjust based on your timestamp field
        },
        order: {
          timestamp: "DESC", // Ensure that the most recent price from the past hour is selected
        },
      });

      if (priceOneHourAgo) {
        const percentChange = this.calculatePercentChange(
          priceOneHourAgo.price,
          price.price
        );

        // If price increase is more than 3%
        if (percentChange >= 3) {
          await this.sendAlert(price.chain, price.price);
        }
      }
    }
  }

  private calculatePercentChange(oldPrice: number, newPrice: number): number {
    return ((newPrice - oldPrice) / oldPrice) * 100;
  }

  private async sendAlert(chain: string, price: number) {
    const email = "hyperhire_assignment@hyperhire.in";
    const subject = `Price Alert: ${chain} Price Increased`;
    const message = `The price of ${chain} has increased by more than 3% in the last hour. Current price: ${price}.`;

    await this.emailService.sendEmail(email, subject, message);
  }
}
