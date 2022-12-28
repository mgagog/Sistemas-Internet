import { Server } from "std/http/server.ts";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";
import { ApolloServer } from "apollo";
import { startStandaloneServer } from "standalone";
import { graphql } from "graphql";
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { typeDefs } from "./schema.ts";

const resolvers = {
  Query,
  Mutation
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 8000 },
  context: ({req}) => {
      const auth = req.headers.auth || "";
      const lang = req.headers.lang || ""
      return {
          auth: auth,
          lang: lang
      }
  }
});

console.log(`Server running on: ${url}`);