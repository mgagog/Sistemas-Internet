import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { booksCollection, usersCollection } from "../db/mongo.ts";
import { isObjectId } from "../functions.ts";

type getBooksContext = RouterContext<
  "/getBooks",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type getUserContext = RouterContext<
"/getUser/:id",
{
    id: string;
} & Record<string | number, string | undefined>,
    Record<string, any>
>;

export const getBooks = async (ctx: getBooksContext) => {
  try{
      const params = getQuery(ctx, { mergeParams: true });
      if (params?.page) {
          if(params?.title){
              const books = await booksCollection
                  .find({
                      title: params.title,
                  })
                  .skip(10*Number(params?.page))
                  .limit(10)
                  .toArray();
              ctx.response.body = books.map((book) => ({
                  id: book._id.toString(),
                  title: book.title,
                  author: book.author,
                  pages: book.pages,
                  isbn: book.isbn
              }));
              ctx.response.status = 200;
              return;
          }
          else{
              const books = await booksCollection
                  .find({})
                  .skip(10*Number(params?.page))
                  .limit(10)
                  .toArray();
              ctx.response.body = books.map((book) => ({
                  id: book._id.toString(),
                  title: book.title,
                  author: book.author,
                  pages: book.pages,
                  isbn: book.isbn
              }));
              ctx.response.status = 200;
              return;
          }
      }
      
      else {
          if(params?.title){
              const books = await booksCollection
                  .find({
                      title: params.title,
                  })
                  .toArray();
              ctx.response.body = books.map((book) => ({
                  id: book._id.toString(),
                  title: book.title,
                  author: book.author,
                  pages: book.pages,
                  isbn: book.isbn
              }));
              ctx.response.status = 200;
              return;
          }
      const books = await booksCollection
          .find({})
          .toArray();
      ctx.response.body = books.map((book) => ({
          id: book._id.toString(),
          title: book.title,
          author: book.author,
          pages: book.pages,
          isbn: book.isbn,
      }));
      ctx.response.status = 200;
      }

      const books = await booksCollection.find({}).toArray();
      ctx.response.body = books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      pages: book.pages,
      isbn: book.isbn,
      }));
  } catch (e) {
    console.error(e);
    ctx.response.body = {
      error: e,
      message: "Internal Server Error",
    };
  }
}
export const getUser = async (ctx: getUserContext) => {
  try{
    if (ctx.params?.id) {
      if(!isObjectId(ctx.params.id)){
        ctx.response.body = "El formato del ID no es correcto"
        ctx.response.status = 404;
        return;
      }
      const user = await usersCollection
        .findOne({
          _id: new ObjectId(ctx.params.id),
        });

      if (user) {
        ctx.response.body = user;
        return;
      }
      else{
        ctx.response.body = "No se encuentra al usuario"
        ctx.response.status = 404;
      }
    } 
    else{  
      ctx.response.body = "No hay id en la URL"
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