import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("supported_tokens")
export class SupportedTokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., 'ethereum' or 'polygon'

  @Column({ name: "is_supported", default: true })
  isSupported: boolean; // Set to true once an alert is triggered

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date; // Date when the alert was created
}
