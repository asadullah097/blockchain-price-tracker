import { Module } from "@nestjs/common";
import { PricesService } from "./prices.service";
import { PricesController } from "./prices.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PricesEntity } from "src/entities/price.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PricesEntity])],
  providers: [PricesService],
  controllers: [PricesController],
})
export class PricesModule {}
