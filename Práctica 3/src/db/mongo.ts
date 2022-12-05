import {
    MongoClient,
    Database,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";

import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

const env = config();

if(!env.MONGO_URL){
    throw Error ("Necesitas una URL en el env");
}

import { BookSchema, UserSchema, AuthorSchema } from "./schemas.ts";

const connectMongoDB = async (): Promise<Database> => {
const db_name = "bookstore";

const client = new MongoClient();
await client.connect(env.MONGO_URL);

const db = client.database(db_name);
return db;
};

const db = await connectMongoDB();
console.info('Connected to database');

export const booksCollection = db.collection<BookSchema>("books");
export const usersCollection = db.collection<UserSchema>("users");
export const authorsCollection = db.collection<AuthorSchema>("authors");