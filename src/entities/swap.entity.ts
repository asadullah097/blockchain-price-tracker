import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("swap")
export class SwapEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal", { precision: 18, scale: 8 })
  ethAmount: number; // Input amount in ETH

  @Column("decimal", { precision: 18, scale: 8, nullable: true })
  btcAmount: number; // Calculated BTC amount

  @Column("decimal", { precision: 18, scale: 8, nullable: true })
  feeInEth: number; // Fee in ETH (0.03% of ethAmount)

  @Column("decimal", { precision: 18, scale: 8, nullable: true })
  feeInUsd: number; // Fee in USD

  @CreateDateColumn()
  createdAt: Date; // Date when the swap was calculated
}
