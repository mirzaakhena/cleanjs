import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Tenant as ITenant } from "../model/tenant.js";
import { Lokasi as ILokasi } from "../model/lokasi.js";
import { Lokasi } from "./gateway_lokasi.js";

@Entity()
export class Tenant implements ITenant {
  //
  @PrimaryColumn({ type: "varchar", length: 20 })
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @ManyToOne(() => Lokasi)
  @JoinColumn({ name: "lokasiID" })
  lokasi: ILokasi;
}
