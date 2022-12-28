import { MongoClient, Database } from "mongo";
import { UsuarioSchema, MensajeSchema} from "./schema.ts";

import { config } from "std/dotenv/mod.ts";

await config({ export: true, allowEmptyValues: true });

const connectMongoDB = async (): Promise<Database> => {
  const db_name = Deno.env.get("DB_NAME");
  const url_mongo = Deno.env.get("URL_MONGO");

  if (!db_name || !url_mongo) {
    throw new Error(
      "Faltan variables de entorno"
    );
  }


  const client = new MongoClient();
  await client.connect(url_mongo);
  const db = client.database(db_name);
  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB ${db.name} connected`);

export const UsuariosCollection = db.collection<UsuarioSchema>("usuarios");
export const MensajesCollection = db.collection<MensajeSchema>("mensajes");
