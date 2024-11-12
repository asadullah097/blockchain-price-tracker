// src/prices/prices.service.ts

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PricesEntity } from "src/entities/price.entity";
import { MoreThan } from "typeorm";
import { stat } from "fs";
import { HttpStatusCode } from "axios";

@Injectable()
export class PricesService {
  constructor(
    @InjectRepository(PricesEntity)
    private readonly pricesRepository: Repository<PricesEntity>
  ) {}

  async getPricesForLast24Hours(): Promise<any> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Fetch the prices within the last 24 hours, grouped by each hour
    const prices = await this.pricesRepository.find({
      where: {
        timestamp: MoreThan(twentyFourHoursAgo),
      },
      order: {
        timestamp: "ASC", // Order by timestamp ascending
      },
    });

    // Group the prices by hour
    const hourlyPrices = this.groupPricesByHour(prices);

    return {
      data: hourlyPrices,
      status: HttpStatusCode.Ok,
    };
  }

  // Helper function to group prices by hour
  private groupPricesByHour(prices: PricesEntity[]): any {
    const groupedPrices: any = {};

    prices.forEach((price) => {
      const hour = new Date(price.timestamp).getHours();
      if (!groupedPrices[hour]) {
        groupedPrices[hour] = [];
      }
      groupedPrices[hour].push(price);
    });

    return groupedPrices;
  }
}
