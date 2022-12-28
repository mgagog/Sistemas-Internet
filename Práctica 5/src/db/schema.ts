import { Usuario, Mensaje } from "../types.ts";
import { ObjectId } from "mongo";

export type UsuarioSchema = Omit<Usuario, "id" | "token"> & {
  _id: ObjectId;
};
export type MensajeSchema = Omit<Mensaje, "id"> & {
  _id: ObjectId;
};
