import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { BookSchema, UserSchema, AuthorSchema } from "../db/schemas.ts";
import { Book, User, Author } from "../types.ts";
import { booksCollection, usersCollection, authorsCollection } from "../db/mongo.ts";
import { isEmail, isbnGenerator, encodeDecode } from "../functions.ts";


type addUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type addAuthorContext = RouterContext<
    "/addAuthor",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

type addBookContext = RouterContext<
    "/addBook",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

export const addUser = async (ctx: addUserContext) => {
  try{
      const result = ctx.request.body({ type: "json" });
      const value = await result.value;
      const foundEmail = await usersCollection.findOne( {email: value?.email} )

      if (!value?.name || !value?.email || !value?.password || !isEmail(value?.email)) {
          ctx.response.body = "El JSON es incorrecto"
          ctx.response.status = 400;
          return;
      }
      if(foundEmail){
          ctx.response.body = "El email introducido ya está registrado"
          ctx.response.status = 400;
          return;
      }
      const user: Partial<User> = {
      name: value.name,
      email: value.email,
      password: encodeDecode(value.password),
      createdAt: new Date().toString(),
      cart: []
      };
      const id = await usersCollection
      .insertOne(user as UserSchema);
      user.id = id.toString();
      ctx.response.body = user;
  } catch (e) {
      console.error(e);
      ctx.response.body = {
        error: e,
        message: "Internal Server Error",
      };
    }
}
export const addAuthor = async (ctx: addAuthorContext) => {
  try{
  const result = ctx.request.body({ type: "json" });
  const value = await result.value;
  
  if (!value?.name) {
      ctx.response.body = "El JSON es incorrecto"
      ctx.response.status = 400;
      return;
  }
  const author: Partial<Author> = {
    name: value.name,
    books: []
  };
  const id = await authorsCollection
    .insertOne(author as AuthorSchema);
  author.id = id.toString();
  ctx.response.body = author;
  } catch (e) {
      console.error(e);
      ctx.response.body = {
        error: e,
        message: "Internal Server Error",
      };
    }
}
export const addBook = async (ctx: addBookContext) => {
  try{
  const result = ctx.request.body({ type: "json" });
  const value = await result.value;
  const existsAuthor = await authorsCollection.findOne( {name: value?.author} )

  if (!value?.title || !value?.author || !value?.pages) {
      ctx.response.body = "El JSON es incorrecto"
      ctx.response.status = 400;
      return;
  }

  if(!existsAuthor){
      ctx.response.body = "No existe ese autor en la base de datos"
      ctx.response.status = 404;
      return;
  }

  const books = await booksCollection.find().toArray();

  const book: Partial<Book> = {
    title: value.title,
    author: value.author,
    pages: value.pages,
    isbn: isbnGenerator(books)
  };

  const id = await booksCollection
    .insertOne(book as BookSchema);
  book.id = id.toString();
  await authorsCollection.updateOne({_id: existsAuthor._id}, {$push:{books: {$each : [book.id]}}})
  ctx.response.body = book;
  } catch (e) {
      console.error(e);
      ctx.response.body = {
        error: e,
        message: "Internal Server Error",
      };
    }
}