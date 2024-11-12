import { Module } from "@nestjs/common";
import { SwapController } from "./swap.controller";
import { SwapService } from "./swap.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PricesEntity } from "src/entities/price.entity";
import { CmcService } from "src/utils/cmc.client";

@Module({
  imports: [TypeOrmModule.forFeature([PricesEntity])],
  controllers: [SwapController],
  providers: [SwapService, CmcService],
})
export class SwapModule {}
