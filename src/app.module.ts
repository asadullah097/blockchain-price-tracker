import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import * as dotenv from "dotenv";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenPriceSyncCron } from "./crons/token-price-sync.cron";
import { CmcService } from "./utils/cmc.client";
import { PricesEntity } from "./entities/price.entity";
import { SupportedTokensEntity } from "./entities/supported_tokens.entity";
import { EmailService } from "./utils/email.service";
import { AlertSyncCron } from "./crons/price-alert-sync.cron";
import { SwapModule } from "./swap/swap.module";
import { PricesModule } from "./prices/prices.module";
import { PriceAlertModule } from "./price-alert/price-alert.module";
import { AlertEntity } from "./entities/price-alert.entity";
import { ScheduleModule } from "@nestjs/schedule";
dotenv.config();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE,
      synchronize: false,
      entities: [PricesEntity, SupportedTokensEntity, AlertEntity],
    }),
    TypeOrmModule.forFeature([
      PricesEntity,
      SupportedTokensEntity,
      AlertEntity,
    ]),
    SwapModule,
    PricesModule,
    PriceAlertModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CmcService,
    TokenPriceSyncCron,
    AlertSyncCron,
    EmailService,
  ],
})
export class AppModule {}
