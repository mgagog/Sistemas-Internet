export const typeDefs = `
  type Usuario {
    id: String!
    username: String!
    password: String!
    mensajes_enviados: [Mensaje!]!
    mensajes_recibidos: [Mensaje!]!
    idioma: String!
    token: String
  }
  type Mensaje {
    id: ID!
    emisor: String!
    receptor: String!
    fecha: String!
  }
  type Query {
    getMessages(page: Int!, perPage: Int!): [Mensaje!]!
  }

  type Mutation {
    createUser(username: String!, password: String!): Usuario!
    login(username: String!, password: String!): String!
    deleteUser: Usuario!
    sendMessage(destinatario: String!, mensaje: String!): Mensaje!
  }
`;
