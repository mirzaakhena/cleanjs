import { Column, Entity, PrimaryColumn } from "typeorm";
import { Lokasi as ILokasi } from "../model/lokasi.js";

@Entity()
export class Lokasi implements ILokasi {
  //
  @PrimaryColumn({ type: "varchar", length: 20 })
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;
}
