import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { isObjectId } from "../functions.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { booksCollection, usersCollection } from "../db/mongo.ts";
type updateCartContext = RouterContext<
    "/updateCart",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

export const updateCart = async (ctx : updateCartContext)  => {
  try{
    const params = getQuery(ctx, { mergeParams: true });
    if (params?.id_book && params?.id_user) {

      if(!isObjectId(params.id_book) || !isObjectId(params.id_user)){
        ctx.response.body = "El formato de al menos un ID no es correcto"
        ctx.response.status = 404;
        return;
      }

      const book = await booksCollection.findOne({ _id: new ObjectId(params.id_book),});

      const user = await usersCollection.findOne({_id: new ObjectId(params.id_user),});

      if(!user){
        ctx.response.body = "No se encontró al usuario"
        ctx.response.status = 404;
        return;
      }
      if(!book){
        ctx.response.body = "No se encontró al libro"
        ctx.response.status = 404;
        return;
      }

      const count = await usersCollection.updateOne(
        { _id: new ObjectId(params.id_user) },
        {
          $push:{cart: {$each : [params.id_book]}}
        }
      );
      if (count) {
        ctx.response.body = {
          id: book?._id.toString(),
          title: book?.title,
          id_author: book?.id_author,
          user_name: user?.name,
          user_email: user?.email
        };
        ctx.response.status = 200;
      } else {
        ctx.response.body = "No se encontró al usuario o al libro"
        ctx.response.status = 404;
      }
    }
    else {
      ctx.response.body = "Falta al menos una id en los parámetros"
      ctx.response.status = 400;
    }
  } catch (e) {
    console.error(e);
    ctx.response.body = {
      error: e,
      message: "Internal Server Error",
    };
  }
}