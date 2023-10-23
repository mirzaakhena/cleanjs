import { Column, Entity, PrimaryColumn } from "typeorm";
import { Admin as IAdmin } from "../model/admin.js";

@Entity()
export class Admin implements IAdmin {
  //
  @PrimaryColumn({ type: "varchar", length: 20 })
  id: string;

  @Column({ type: "varchar", length: 50 })
  name: string;

  @Column({ type: "varchar", length: 100 })
  email: string;
}
