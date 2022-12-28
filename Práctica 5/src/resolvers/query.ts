import { Mensaje } from "../types.ts";
import { MensajesCollection } from "../db/dbconnection.ts";

export const Query = {
  getMessages: async (parent: unknown, args: { page: number, perPage: number }):Promise<Mensaje[]> => {
    try {
      if(!args.page)
        throw new Error("No se ha pasado la página deseada");

      if(!args.perPage)
        throw new Error("No se ha pasado el número de mensajes por página");
      
      if(args.page < 0)
        throw new Error("La página no puede ser negativa");

      if(args.perPage < 10 || args.perPage > 200)
        throw new Error("Límite por página no permitido (debe estar entre 10 y 200)");
      
      const mensajes = await MensajesCollection
          .find({})
          .skip(args.perPage*args.page)
          .limit(args.perPage)
          .toArray();
      return mensajes.map((mensaje) => ({ ...mensaje, id: mensaje._id.toString() }));
    } catch (e) {
    throw new Error(e);
    }
  }
};
