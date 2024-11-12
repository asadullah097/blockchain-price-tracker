import { Module } from "@nestjs/common";
import { PriceAlertService } from "./price-alert.service";
import { PriceAlertController } from "./price-alert.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PricesEntity } from "src/entities/price.entity";
import { AlertEntity } from "src/entities/price-alert.entity";
import { EmailService } from "src/utils/email.service";

@Module({
  imports: [TypeOrmModule.forFeature([AlertEntity, PricesEntity])],
  providers: [PriceAlertService, EmailService],
  controllers: [PriceAlertController],
})
export class PriceAlertModule {}
