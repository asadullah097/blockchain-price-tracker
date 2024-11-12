// src/price-alert/price-alert.controller.ts

import { Controller, Post, Body } from "@nestjs/common";
import { PriceAlertService } from "./price-alert.service";
import { CreatePriceAlertDto } from "./dto/set.alert.dto";

@Controller("price-alert")
export class PriceAlertController {
  constructor(private readonly priceAlertService: PriceAlertService) {}

  // Endpoint to set a price alert
  @Post("set")
  async setPriceAlert(@Body() body: CreatePriceAlertDto) {
    const { chain, price, email } = body;
    return this.priceAlertService.setPriceAlert(chain, price, email);
  }
}
