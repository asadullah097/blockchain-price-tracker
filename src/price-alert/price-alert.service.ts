// src/price-alert/price-alert.service.ts

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PricesEntity } from "src/entities/price.entity";
import { EmailService } from "src/utils/email.service"; // Assuming an email service exists
import { AlertEntity } from "src/entities/price-alert.entity";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HttpStatusCode } from "axios";

@Injectable()
export class PriceAlertService {
  constructor(
    @InjectRepository(AlertEntity)
    private readonly priceAlertRepository: Repository<AlertEntity>,
    @InjectRepository(PricesEntity)
    private readonly pricesRepository: Repository<PricesEntity>,
    private readonly emailService: EmailService // Inject email service
  ) {}

  // Set an alert for a specific price on a specific chain
  async setPriceAlert(chain: string, price: number, email: string) {
    // Create a new price alert
    try {
      const existingAlert = await this.priceAlertRepository.findOne({
        where: { chain, email },
      });
      if (existingAlert) {
        return {
          message: `Price alert already exists for ${chain}.`,
          status: HttpStatusCode.BadRequest,
          data: {},
        };
      }
      await this.priceAlertRepository.save({
        chain,
        targetPrice: price,
        email,
      });

      return {
        message: `Price alert set for ${chain} at ${price} USD.`,
        status: HttpStatusCode.Ok,
        data: {},
      };
    } catch (error) {
      throw new Error(
        `Failed to set price alert for ${chain}: ${error.message}`
      );
    }
  }
  @Cron(CronExpression.EVERY_10_MINUTES)
  // Check if any price alerts are triggered (call this periodically)
  async checkPriceAlerts(): Promise<void> {
    try {
      const priceAlerts = await this.priceAlertRepository.find();

      for (const alert of priceAlerts) {
        const latestPrice = await this.pricesRepository.findOne({
          where: { chain: alert.chain },
          order: { timestamp: "DESC" }, // Get the latest price
        });

        // If the price is less than or equal to the alert price, trigger the alert
        // if (latestPrice && latestPrice.price <= alert.targetPrice) {
        await this.sendAlertEmail(alert.email, alert.chain, latestPrice.price);
        // }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Send an alert email when the price condition is met
  private async sendAlertEmail(email: string, chain: string, price: number) {
    const subject = `Price Alert: ${chain} has reached the target price`;
    const message = `The price of ${chain} has reached your target price of ${price} USD.`;

    await this.emailService.sendEmail(email, subject, message);
  }
}
