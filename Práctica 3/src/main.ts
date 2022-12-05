/*
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import {
  ObjectId,
  MongoClient,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";

const isEmail = (email: string): boolean => {
    const formato = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    return formato.test(email);
}

const isObjectId = (id: string): boolean => {
  const formato = /^[0-9a-fA-F]{24}$/;

  return formato.test(id);
}

const isbnGenerator = (books: BookSchema[]): string =>{ //3 2 5 3 1
    const numbers = '0123456789';
    let isbn: string;
    let string1;
    let string2;
    let string3;
    let string4;
    let string5;

    do{
        isbn = '';
        string1 = '';
        string2 = '';
        string3 = '';
        string4 = '';
        string5 = '';

        for(let i=0; i<3; i++){
            string1 += numbers[Math.floor(Math.random() * numbers.length)];
            string4 += numbers[Math.floor(Math.random() * numbers.length)];
        }
        
        for(let i=0; i<2; i++){  
            string2 += numbers[Math.floor(Math.random() * numbers.length)];
        }

        for(let i=0; i<5; i++){
            string3 += numbers[Math.floor(Math.random() * numbers.length)];
        }
        string5 += numbers[Math.floor(Math.random() * numbers.length)];

        isbn += string1 + ' ' + string2+ ' ' + string3+ ' ' + string4+ ' ' + string5;

    }while(books.find(elem => elem.isbn === isbn));
    
    return (isbn + string1 + ' ' + string2+ ' ' + string3+ ' ' + string4+ ' ' + string5); 
  }

  const encodeDecode = (s: string) =>
  {
     let nstr = ''
  
     for (let i=0; i <  s.length; i++) {
         nstr += String.fromCharCode(s.charCodeAt(i) ^ 1);
     }
  
      return nstr;
  };

type Book = {
  id: string;
  title: string;
  author: string;
  pages: number;
  isbn: string;
};

type Author = {
  id: string;
  name: string;
  books: string[]
};

type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    cart: string[]
};

type BookSchema = Omit<Book, "id"> & { _id: ObjectId };
type AuthorSchema = Omit<Author, "id"> & { _id: ObjectId };
type UserSchema = Omit<User, "id"> & { _id: ObjectId };

const mongo_usr = "marcos";
const mongo_pwd = "n3br1j4";
const db_name = "bookstore";
const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@cluster-nebrija.ymbd2ty.mongodb.net/${db_name}?authMechanism=SCRAM-SHA-1`;

const client = new MongoClient();
await client.connect(mongo_url);
const db = client.database(db_name);
console.log("Connected to DB");

const router = new Router();

router
  .get("/getBooks", async (ctx) => {
    try{
        const params = getQuery(ctx, { mergeParams: true });
        if (params?.page) {
            if(params?.title){
                const books = await db
                    .collection<BookSchema>("books")
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
                const books = await db
                    .collection<BookSchema>("books")
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
                const books = await db
                    .collection<BookSchema>("books")
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
        const books = await db
            .collection<BookSchema>("books")
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

        const books = await db.collection<BookSchema>("books").find({}).toArray();
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
  })
  .get("/getUser/:id", async (ctx) => {
    try{
      if (ctx.params?.id) {
        if(!isObjectId(ctx.params.id)){
          ctx.response.body = "El formato del ID no es correcto"
          ctx.response.status = 404;
          return;
        }
        const user = await db
          .collection<UserSchema>("users")
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
  })
  .post("/addUser", async (ctx) => {
    try{
        const result = ctx.request.body({ type: "json" });
        const value = await result.value;
        const foundEmail = await db.collection<UserSchema>("users").findOne( {email: value?.email} )

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
        const id = await db
        .collection<UserSchema>("users")
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
  })
  .post("/addAuthor", async (ctx) => {
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
    const id = await db
      .collection<AuthorSchema>("authors")
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
  })
  .post("/addBook", async (ctx) => {
    try{
    const result = ctx.request.body({ type: "json" });
    const value = await result.value;
    const existsAuthor = await db.collection<AuthorSchema>("authors").findOne( {name: value?.author} )

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

    const books = await db.collection<BookSchema>("users").find().toArray();

    const book: Partial<Book> = {
      title: value.title,
      author: value.author,
      pages: value.pages,
      isbn: isbnGenerator(books)
    };

    const id = await db
      .collection<BookSchema>("books")
      .insertOne(book as BookSchema);
    book.id = id.toString();
    await db.collection<AuthorSchema>("authors").updateOne({_id: existsAuthor._id}, {$push:{books: {$each : [book.id]}}})
    ctx.response.body = book;
    } catch (e) {
        console.error(e);
        ctx.response.body = {
          error: e,
          message: "Internal Server Error",
        };
      }
  })
  .delete("/deleteUser", async (ctx) => {
    try{
      const params = getQuery(ctx, { mergeParams: true });
      if (params?._id) {
        if(!isObjectId(params.id)){
          ctx.response.body = "El formato del ID no es correcto"
          ctx.response.status = 404;
        }
        const userEliminado = await db.collection<UserSchema>("users").deleteOne({
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
  })
  .put("/updateCart", async (ctx) => {
    try{
      const params = getQuery(ctx, { mergeParams: true });
      if (params?.id_book || params?.id_user) {

        if(!isObjectId(params.id_book) || !isObjectId(params.id_user)){
          ctx.response.body = "El formato de al menos un ID no es correcto"
          ctx.response.status = 404;
        }

        const book = await db.collection<BookSchema>("books").findOne({ _id: new ObjectId(params.id_book),});

        const user = await db.collection<UserSchema>("users").findOne({_id: new ObjectId(params.id_user),});

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

        const count = await db.collection<UserSchema>("users").updateOne(
          { _id: new ObjectId(params.id_user) },
          {
            $push:{cart: {$each : [params.id_book]}}
          }
        );
        if (count) {
          ctx.response.body = {
            id: book?._id.toString(),
            title: book?.title,
            author: book?.author,
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
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
*/

import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { getBooks, getUser } from "./resolvers/get.ts";
import { addUser, addAuthor, addBook } from "./resolvers/post.ts";
import { deleteUser } from "./resolvers/delete.ts";
import { updateCart } from "./resolvers/put.ts";

const router = new Router();

const env = config();

if(!env.PORT){
  throw Error ("Necesitas un puerto en el env");
}
router
  .get("/getBooks", getBooks)
  .get("/getUser/:id", getUser)
  .post("/addUser", addUser)
  .post("/addAuthor", addAuthor)
  .post("/addBook", addBook)
  .delete("/deleteUser", deleteUser)
  .put("/updateCart", updateCart);

const app = new Application();
console.log('Connected to database');

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: Number(env.PORT) });