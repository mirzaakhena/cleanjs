import { Column, Entity, PrimaryColumn } from "typeorm";
import { Image } from "../model/image.js";

@Entity()
export class Reward {
  //

  @PrimaryColumn({ type: "varchar", length: 20 })
  id: string;

  @Column({ type: "timestamp" })
  createdDate: Date;

  @Column({ type: "varchar", length: 30 })
  title: string;

  @Column({ type: "varchar", length: 60 })
  description: string;

  @Column({ type: "int" })
  point: number;

  @Column({ type: "int" })
  stock: number;

  @Column({ type: "jsonb", nullable: true })
  image: Image;
  //
}
