import { Server } from "std/http/server.ts";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";

import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { typeDefs } from "./schema.ts";

import { config } from "std/dotenv/mod.ts";

await config({ export: true, allowEmptyValues: true });


const resolvers = {
  Query,
  Mutation,
};

const portEnv = Number(Deno.env.get("PORT"));
if (!portEnv) {
  throw new Error(
    "Hace falta un PORT en el env"
  );
}

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: portEnv,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:${Deno.env.get("PORT")}/graphql`);
