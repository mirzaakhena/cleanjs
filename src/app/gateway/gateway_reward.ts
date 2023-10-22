// findManyReward: { requestType: "query", gateway: null },
// findOneReward: { requestType: "query", gateway: null },
// saveReward: { requestType: "command", gateway: null },

import { Column, Entity, FindOptionsWhere, PrimaryColumn } from "typeorm";
import { DataSource } from "typeorm/browser";
import { getManager } from "../../framework/gateway_typeorm.js";
import { FindManyEntity, FindOneEntity } from "../../framework/repo.js";
import { Image } from "../model/image.js";
import { FindManyRewardFilter, Reward as IReward, RewardID } from "../model/reward.js";

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

  @Column({ type: "jsonb", nullable: true })
  declare image: Image;
  //
}

// export const saveReward = (ds: DataSource): SaveEntity<Reward, RewardID> => {
//   return async (ctx, req) => {
//     await getManager(ctx, ds).getRepository(Reward).save(req);
//     return req.id;
//   };
// };

// export const findManyReward = (ds: DataSource): FindManyEntity<Reward, FindManyRewardFilter> => {
//   return async (ctx, filter) => {
//     //

//     let where: FindOptionsWhere<Reward> = {};

//     //

//     const size = filter.size || 20;
//     const page = (filter.page && filter.page < 1 ? 1 : filter.page) || 1;

//     const result = await getManager(ctx, ds) //
//       .getRepository(Reward)
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

// export const findOneReward = (ds: DataSource): FindOneEntity<Reward, RewardID> => {
//   return async (ctx, id) => await getManager(ctx, ds).getRepository(Reward).findOneBy({ id });
// };
