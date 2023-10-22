// findManyStruk: { requestType: "query", gateway: null },
// findOneStruk: { requestType: "query", gateway: null },
// saveStruk: { requestType: "command", gateway: null },

import { Column, Entity, FindOptionsWhere, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

import { Admin as IAdmin } from "../model/admin.js";
import { FindManyStrukFilter, Struk as IStruk, StrukID } from "../model/struk.js";

import { Tenant as ITenant } from "../model/tenant.js";
import { User as IUser } from "../model/user.js";

import { DataSource } from "typeorm/browser";
import { getManager } from "../../framework/gateway_typeorm.js";
import { FindManyEntity, FindOneEntity } from "../../framework/repo.js";
import { ApprovalStatus } from "../model/approval.js";
import { Image } from "../model/image.js";
import { Lokasi as ILokasi } from "../model/lokasi.js";
import { Admin } from "./gateway_admin.js";
import { Lokasi } from "./gateway_lokasi.js";
import { Tenant } from "./gateway_tenant.js";
import { User } from "./gateway_user.js";

@Entity()
export class Struk extends IStruk {
  //

  @PrimaryColumn({ type: "varchar", length: 20 })
  declare id: string;

  @Column({ type: "varchar", length: 10 })
  declare status: ApprovalStatus;

  // @ManyToOne(() => Admin)
  // @JoinColumn({ name: "approvalByAdminID" })
  // declare approvalBy: IAdmin;

  @Column({ type: "timestamp", nullable: true })
  declare approvalDate: Date;

  @Column({ type: "timestamp" })
  declare createdDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  declare user: IUser;

  // @ManyToOne(() => Lokasi)
  // @JoinColumn({ name: "lokasiID" })
  // lokasi: ILokasi;

  // @ManyToOne(() => Tenant)
  // @JoinColumn({ name: "tenantID" })
  // tenant: ITenant;

  @Column({ type: "varchar", length: 30 })
  declare billNumber: string;

  @Column({ type: "int" })
  declare totalTransaksi: number;

  @Column({ type: "jsonb", nullable: true })
  declare screenshot: Image;

  //
}

// export const saveStruk = (ds: DataSource): SaveEntity<Struk, StrukID> => {
//   return async (ctx, req) => {
//     await getManager(ctx, ds).getRepository(Struk).save(req);
//     return req.id;
//   };
// };

// export const findManyStruk = (ds: DataSource): FindManyEntity<Struk, FindManyStrukFilter> => {
//   return async (ctx, filter) => {
//     //

//     let where: FindOptionsWhere<Struk> = {};

//     //

//     const size = filter.size || 20;
//     const page = (filter.page && filter.page < 1 ? 1 : filter.page) || 1;

//     const result = await getManager(ctx, ds) //
//       .getRepository(Struk)
//       .findAndCount({
//         take: size,
//         skip: (page - 1) * size,
//         where,
//         relations: {
//           approvalBy: true,
//           user: true,
//         },
//         order: {},
//       });

//     return result;
//   };
// };

// export const findOneStruk = (ds: DataSource): FindOneEntity<Struk, StrukID> => {
//   return async (ctx, id) => await getManager(ctx, ds).getRepository(Struk).findOneBy({ id });
// };
