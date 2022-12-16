import { gql } from "graphql_tag";

export const typeDefs = gql`
  type Car {
    id: ID!
    plate: String!
    brand: String!
    seats: Int!
  }
  type Coche {
    id: ID!
    marca: String!
    matricula: String!
    precio: Int!
  }
  type Vendedor {
    id: ID!
    nombre: String!
    apellido: String!
    coches: [Coche!]!
  }
  type Concesionario {
    id: ID!
    ciudad: String!
    nombre: String!
    vendedores: [Vendedor!]!
  }
  type Query {
    obtenerCoches(id: ID, precio_min: Int, precio_max: Int): [Coches!]!
    obtenerVendedores(id: ID, nombre: String, apellido: String): [Vendedores!]!
    obtenerConcesionarios(id: ID, localidad: String): [Concesionarios!]!
  }

  type Mutation {
    crearCoche(matricula: String!, marca: String!, precio: Int!): Coche!
    crearVendedor(nombre: String!, apellido: String!, coches: [Coche!]!): Vendedor!
    crearConcesionario(ciudad: String!, nombre: String!, vendedores: [Vendedor!]!): Concesionario!
    cocheAVendedor(id_coche: ID!, id_vendedor: ID!): Vendedor!
    vendedorAConcesionario (id_vendedor: ID!, id_concesionario: ID!): Concesionario!
  }
`;
