import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { isObjectId } from "../functions.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { usersCollection } from "../db/mongo.ts";

type deleteUserContext = RouterContext<
    "/deleteUser",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

export const deleteUser = async (ctx: deleteUserContext) => {
  try{
    const params = getQuery(ctx, { mergeParams: true });
    if (params?._id) {
      if(!isObjectId(params.id)){
        ctx.response.body = "El formato del ID no es correcto"
        ctx.response.status = 404;
      }
      const userEliminado = await usersCollection.deleteOne({
        _id: new ObjectId (params._id),
      });
      if (userEliminado) {
        ctx.response.body = "Usuario eliminado";
        ctx.response.status = 200;
      } else {
        ctx.response.body = "No se ha encontrado al usuario"
        ctx.response.status = 404;
      }
    }
    else{
      ctx.response.body = "No se ha pasado ningún _id"
      ctx.response.status = 404;
    }
  } catch (e) {
    console.error(e);
    ctx.response.body = {
      error: e,
      message: "Internal Server Error",
    };
  }
}