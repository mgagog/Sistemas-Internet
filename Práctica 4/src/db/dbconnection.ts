import { MongoClient, Database } from "mongo";
import { CarSchema, CocheSchema, VendedorSchema, ConcesionarioSchema } from "./schema.ts";

import { config } from "std/dotenv/mod.ts";

await config({ export: true, allowEmptyValues: true });

const connectMongoDB = async (): Promise<Database> => {
  const db_name = Deno.env.get("DB_NAME");
  const url_mongo = Deno.env.get("URL_MONGO");

  if (!db_name || !url_mongo) {
    throw new Error(
      "Hacen falta una URL y una base de datos en el env"
    );
  }

  const client = new MongoClient();
  await client.connect(url_mongo);
  const db = client.database(db_name);
  return db;
};

const db = await connectMongoDB();
console.info(`Conectado a la base de datos ${db.name}`);

export const carsCollection = db.collection<CarSchema>("cars");
export const cochesCollection = db.collection<CocheSchema>("coches");
export const vendedoresCollection = db.collection<VendedorSchema>("vendedores");
export const concesionariosCollection = db.collection<ConcesionarioSchema>("concesionarios");