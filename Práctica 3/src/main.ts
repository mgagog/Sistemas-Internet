import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
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