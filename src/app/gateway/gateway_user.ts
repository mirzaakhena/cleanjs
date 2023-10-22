// saveUser: { requestType: "command", gateway: null },

import { Column, Entity, FindOptionsWhere, PrimaryColumn } from "typeorm";
import { FindManyUserFilter, Gender, User as IUser, UserID } from "../model/user.js";
import { getManager } from "../../framework/gateway_typeorm.js";
import { DataSource } from "typeorm/browser";
import { FindManyEntity } from "../../framework/repo.js";

@Entity()
export class User extends IUser {
  //

  @PrimaryColumn({ type: "varchar", length: 20 })
  declare id: UserID;

  @Column({ type: "varchar", length: 50 })
  declare name: string;

  // @Column({ type: "timestamp", nullable: true })
  // createdDate: Date;

  // @Column({ type: "varchar", length: 20 })
  // phone: string;

  // @Column({ type: "varchar", length: 10 })
  // gender: Gender;

  // @Column({ type: "timestamp", nullable: true })
  // birthDate: Date;

  // @Column({ type: "varchar", length: 200 })
  // address: string;

  // @Column({ type: "varchar", length: 60 })
  // kecamatan: string;

  // @Column({ type: "varchar", length: 60 })
  // kabupatenOrKota: string;

  // @Column({ type: "varchar", length: 30 })
  // kodeRefferal: string;

  @Column({ type: "int" })
  declare totalPoints: number;
  //
}

// export const findManyUser = (ds: DataSource): FindManyEntity<User, FindManyUserFilter> => {
//   //

//   return async (ctx, filter) => {
//     //

//     let where: FindOptionsWhere<User> = {};

//     //

//     const size = filter.size || 20;
//     const page = (filter.page && filter.page < 1 ? 1 : filter.page) || 1;

//     const result = await getManager(ctx, ds) //
//       .getRepository(User)
//       .findAndCount({
//         take: size,
//         skip: (page - 1) * size,
//         where,
//         relations: {},
//         order: {},
//       });

//     return result;
//   };
// };

// export const saveUser = (ds: DataSource): SaveEntity<User, UserID> => {
//   return async (ctx, req) => {
//     await getManager(ctx, ds).getRepository(User).save(req);
//     return req.id;
//   };
// };
