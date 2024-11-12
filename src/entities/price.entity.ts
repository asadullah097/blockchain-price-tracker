import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity("prices")
@Index(["chain", "timestamp"])
export class PricesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;

  @Column()
  symbol: string;

  @Column("decimal", { precision: 18, scale: 8 })
  price: number;

  @Column("decimal", { name: "percent_change_1h", precision: 18, scale: 8 })
  percentChange1h: number;

  @Column("decimal", { name: "percent_change_24h", precision: 18, scale: 8 })
  percentChange24h: number;

  @CreateDateColumn()
  timestamp: Date;
}
