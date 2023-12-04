import { Column, Entity, PrimaryColumn } from "typeorm";
import { Reward as IReward } from "../model/reward.js";

@Entity()
export class Reward extends IReward {
  //

  @PrimaryColumn({ type: "varchar", length: 20 })
  declare id: string;

  @Column({ type: "timestamp" })
  declare createdDate: Date;

  @Column({ type: "varchar", length: 30 })
  declare title: string;

  @Column({ type: "varchar", length: 60 })
  declare description: string;

  @Column({ type: "int" })
  declare point: number;

  @Column({ type: "int" })
  declare stock: number;

  //
}
