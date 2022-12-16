import { Car, Coche, Vendedor, Concesionario } from "../types.ts";
import { ObjectId } from "mongo";

export type CarSchema = Omit<Car, "id"> & {
  _id: ObjectId;
};

export type CocheSchema = Omit<Coche, "id"> & {
  _id: ObjectId;
};

export type VendedorSchema = Omit<Vendedor, "id"> & {
  _id: ObjectId;
};

export type ConcesionarioSchema = Omit<Concesionario, "id"> & {
  _id: ObjectId;
};