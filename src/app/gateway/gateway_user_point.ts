// saveUserPoint: { requestType: "command", gateway: null },

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User as IUser } from "../model/user.js";
import { UserPoint as IUserPoint } from "../model/user_point.js";
import { User } from "./gateway_user.js";

@Entity()
export class UserPoint implements IUserPoint {
  //
  @PrimaryColumn({ type: "varchar", length: 20 })
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: IUser;

  @Column({ type: "int" })
  point: number;

  @Column({ type: "timestamp", nullable: true })
  createdDate: Date;
}

// export const saveUserPoint = (ds: DataSource): SaveEntity<UserPoint, UserPointID> => {
//   return async (ctx, req) => {
//     await getManager(ctx, ds).getRepository(UserPoint).save(req);
//     return req.id;
//   };
// };
