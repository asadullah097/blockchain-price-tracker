import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("alert")
export class AlertEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string; // e.g., 'ethereum' or 'polygon'

  @Column({ name: "target_price" })
  targetPrice: number;

  @Column()
  email: string;

  @Column({ name: "is_triggered", default: false })
  isTriggered: boolean; // Set to true once an alert is triggered

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date; // Date when the alert was created
}
