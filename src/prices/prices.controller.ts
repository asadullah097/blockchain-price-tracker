// src/prices/prices.controller.ts

import { Controller, Get } from "@nestjs/common";
import { PricesService } from "./prices.service";

@Controller("prices")
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  // Endpoint to get prices for the last 24 hours
  @Get("last-24-hours")
  async getPricesForLast24Hours() {
    return await this.pricesService.getPricesForLast24Hours();
  }
}
