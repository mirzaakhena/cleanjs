import { DataSource, EntityTarget, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, ObjectLiteral } from "typeorm";
import { Context, Middleware } from "./core.js";
import { BaseEntity, BaseFindManyFilter, FindManyEntity, FindOneEntity, Identifier, SaveEntity } from "./repo.js";

const TRANSACTION_FIELD = "transaction";

export const transactionMiddleware: (ds: DataSource) => Middleware = (ds: DataSource) => {
  //

  return (funcType, requestType, name, inport) => {
    //

    return async (ctx, input) => {
      //

      if (requestType === "query" || funcType === "gateway" || (ctx.data[TRANSACTION_FIELD] ?? null)) {
        return await inport(ctx, input);
      }

      return await ds.transaction(async (em) => {
        //

        console.log(">>>>>> START TRANSACTION", name);

        try {
          const result = await inport({ ...ctx, data: { ...ctx.data, [TRANSACTION_FIELD]: em } }, input);

          console.log(">>>>>> COMMIT TRANSACTION", name);

          return result;

          //
        } catch (error: any) {
          //
          console.log(">>>>>> ROLLBACK TRANSACTION", name);
          throw error;
        }
      });
    };
  };
};

export const getManager = (ctx: Context, ds: DataSource) => {
  return ctx.data?.[TRANSACTION_FIELD] ? (ctx.data[TRANSACTION_FIELD] as DataSource) : ds;
};

export const saveEntity = <U extends Identifier = string, T extends BaseEntity<U> = BaseEntity<U>>(ds: DataSource, entityClass: EntityTarget<T>): SaveEntity<T, U> => {
  return async (ctx, req) => {
    await getManager(ctx, ds).getRepository(entityClass).save(req);
    return req.id;
  };
};

export const findManyEntity = <U extends Identifier = string, T extends BaseEntity<U> = BaseEntity<U>, V extends BaseFindManyFilter = BaseFindManyFilter>(
  ds: DataSource,
  entityClass: EntityTarget<T>,
  options?: {
    where?: FindOptionsWhere<T>;
    relations?: FindOptionsRelations<T>;
    order?: FindOptionsOrder<T>;
  }
): FindManyEntity<T, V> => {
  //

  return async (ctx, filter) => {
    //

    const size = filter.size || 20;
    const page = (filter.page && filter.page < 1 ? 1 : filter.page) || 1;

    const result = await getManager(ctx, ds) //
      .getRepository(entityClass)
      .findAndCount({
        take: size,
        skip: (page - 1) * size,
        where: options?.where,
        relations: options?.relations,
        order: options?.order,
      });

    return result;
  };
};

export const findOneEntity = <U extends Identifier = string, T extends BaseEntity<U> = BaseEntity<U>>(
  ds: DataSource,
  entityClass: EntityTarget<T>,
  options?: {
    where?: FindOptionsWhere<T>;
    relations?: FindOptionsRelations<T>;
  }
): FindOneEntity<T, U> => {
  return async (ctx, id) => {
    //

    let where: FindOptionsWhere<T> | undefined = options?.where;

    if (!options || options.where === undefined) {
      where = { ...where, id: id as any };
    }

    const result = await getManager(ctx, ds).getRepository(entityClass).findOne({
      where,
      relations: options?.relations,
    });

    return result as T | null;
  };
};
