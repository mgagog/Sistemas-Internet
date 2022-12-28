import { ObjectId } from "mongo";
import { UsuariosCollection, MensajesCollection } from "../db/dbconnection.ts";
import { UsuarioSchema, MensajeSchema } from "../db/schema.ts";
import { Usuario, Mensaje } from "../types.ts";
import * as bcrypt from "bcrypt";
import { createJWT, verifyJWT } from "../lib/jwt.ts";

export const Mutation = {
  createUser: async (
    parent: unknown,
    args: {
      username: string;
      password: string;
    },
    ctx:any
  ): Promise<Usuario> => {
    try {
      const usuario: UsuarioSchema | undefined = await UsuariosCollection.findOne({
        username: args.username,
      });

      if (usuario) {
        throw new Error("El usuario ya existe");
      }

      if(!ctx.lang)
        throw new Error("El idioma no está en el header lang");

      const hashedPassword = await bcrypt.hash(args.password);

      const _id = new ObjectId();

      const nuevoUsuario: UsuarioSchema = {
        _id,
        username: args.username,
        password: hashedPassword,
        mensajes_enviados: [],
        mensajes_recibidos: [],
        idioma: ctx.lang.toString()
      };

      await UsuariosCollection.insertOne(nuevoUsuario);
      return { ...nuevoUsuario, id: nuevoUsuario._id.toString() };

    } catch (e) {
      throw new Error(e);
    }
  },
  login: async (
    parent: unknown,
    args: {
      username: string;
      password: string;
    }
  ): Promise<string> => {
    try {
      const usuario: UsuarioSchema | undefined = await UsuariosCollection.findOne({
        username: args.username,
      });

      if (!usuario) {
        throw new Error("El usuario no existe");
      }

      if(!usuario.password){
        throw new Error("La contraseña no existe");
      }

      const validPassword = await bcrypt.compare(args.password, usuario.password);
      if (!validPassword) 
        throw new Error("Contraseña incorrecta");
      
      const clave = Deno.env.get("JWT_SECRET");
      if(!clave)
        throw new Error("No se encuentra la clave para el JWT en el env");
      
      const token = await createJWT(
        {
          username: usuario.username,
          id: usuario._id.toString(),
          idioma: usuario.idioma
        },
        clave!
      );
      return token;
    } catch (e) {
      throw new Error(e);
    }
  },
  deleteUser: async (
    parent: unknown,
    args: {},
    ctx: any
  ): Promise<Usuario> => {
    try {
      if(!ctx.auth)
        throw new Error("El JWT no está en el header auth");
      
      const clave = Deno.env.get("JWT_SECRET");
      if(!clave)
        throw new Error("No se encuentra la clave para el JWT en el env");
      
      const verificacion = await verifyJWT(ctx.auth, clave)
      if (!verificacion)
        throw new Error("JWT incorrecto. Operación no permitida.");
      
      const usuario: UsuarioSchema | undefined = await UsuariosCollection.findOne({
        username: verificacion.username as string,
      });
      
      if (!usuario) {
        throw new Error("El usuario no existe");
      }
      await UsuariosCollection.deleteOne({
        username: verificacion.username as string,
      });

      return {...usuario, id: usuario._id.toString()};
    } catch (e) {
      throw new Error(e);
    }
  },
  sendMessage: async (
    parent: unknown,
    args: {
      destinatario: string;
      mensaje: string;
    },
    ctx:any
  ): Promise<Mensaje> => {
    try {
      if(!ctx.auth)
        throw new Error("El JWT no está en el header auth");
      
      if(!ctx.lang)
        throw new Error("El idioma no está en el header lang");

      const clave = Deno.env.get("JWT_SECRET");
      if(!clave)
        throw new Error("No se encuentra la clave para el JWT en el env");
      
      const destino: UsuarioSchema | undefined = await UsuariosCollection.findOne({
        username: args.destinatario,
      });

      if (!destino) {
        throw new Error("El destinatario no existe");
      }

      const verificacion = await verifyJWT(ctx.auth, clave)
      if (!verificacion)
        throw new Error("JWT incorrecto. Operación no permitida.");
      
      const nuevoMensaje: MensajeSchema = {
        _id: new ObjectId,
        emisor: verificacion.username as string,
        receptor: args.destinatario,
        fecha: new Date().toLocaleDateString()
      }

      await MensajesCollection.insertOne(nuevoMensaje);
      
      await UsuariosCollection.updateOne(
        { username: verificacion.username as string },
        {
          $push:{mensajes_enviados: {$each : [{
            id: nuevoMensaje._id.toString(),
            emisor: nuevoMensaje.emisor,
            receptor: nuevoMensaje.receptor,
            fecha: nuevoMensaje.fecha
          }]}}
        }
      );

      await UsuariosCollection.updateOne(
        { username: args.destinatario },
        {
          $push:{mensajes_enviados: {$each : [{
            id: nuevoMensaje._id.toString(),
            emisor: nuevoMensaje.emisor,
            receptor: nuevoMensaje.receptor,
            fecha: nuevoMensaje.fecha
          }]}}
        }
      );
      return { ...nuevoMensaje, id: nuevoMensaje._id.toString() };

    } catch (e) {
      throw new Error(e);
    }
  }
};
