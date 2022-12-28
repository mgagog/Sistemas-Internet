import { ObjectId } from "mongo";
import { carsCollection, cochesCollection, vendedoresCollection, concesionariosCollection } from "../db/dbconnection.ts";
import { Car, Coche, Vendedor, Concesionario} from "../types.ts";


const esMatricula = (matricula: string): boolean => {
  const formato = /^[0-9]{4}\s{1}([A-Z]{3}$)/;

  return formato.test(matricula);
}


export const Mutation = {
  crearCoche: async (
    _: unknown,
    args: { matricula: string; marca: string; precio: number}
  ): Promise<Coche> => {
    try {
      const exists = await cochesCollection.findOne({ matricula: args.matricula });
      if (exists) {
        throw new Error("Ya hay un coche con esa matrícula");
      }
      if (!esMatricula(args.matricula)) {
        throw new Error("Formato de matrícula no válida");
      }
      const coche = await cochesCollection.insertOne({
        matricula: args.matricula,
        marca: args.marca,
        precio: args.precio,
      });
      return {
        id: coche.toString(),
        matricula: args.matricula,
        marca: args.marca,
        precio: args.precio
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  crearVendedor: async (
    _: unknown,
    args: { nombre: string; apellido: string;}
  ): Promise<Vendedor> => {
    try {
      const vendedor = await vendedoresCollection.insertOne({
        nombre: args.nombre,
        apellido: args.apellido,
        coches: [],
      });
      return {
        id: vendedor.toString(),
        nombre: args.nombre,
        apellido: args.apellido,
        coches: [],
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  crearConcesionario: async (
    _: unknown,
    args: { nombre: string; ciudad: string;}
  ): Promise<Concesionario> => {
    try {
      const exists = await concesionariosCollection.findOne({ nombre: args.nombre, ciudad: args.ciudad });
      if (exists) {
        throw new Error("Ya existe un concesionario con ese nombre en la misma localidad");
      }

      const concesionario = await concesionariosCollection.insertOne({
        nombre: args.nombre,
        ciudad: args.ciudad,
        vendedores: [],
      });
      return {
        id: concesionario.toString(),
        nombre: args.nombre,
        ciudad: args.ciudad,
        vendedores: [],
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  cocheAVendedor: async (
    _: unknown,
    args: { matricula: string; id_vendedor: string;}
  ): Promise<Vendedor> => {
    try {
      const coche = await cochesCollection.findOne({ matricula: args.matricula });
      if (!coche) {
        throw new Error("No existe un coche con esa matrícula");
      }
      const vendedor = await vendedoresCollection.findOne({ _id: new ObjectId(args.id_vendedor) });
      if (!vendedor) {
        throw new Error("No existe un vendedor con ese ID");
      }
      await vendedoresCollection.updateOne(
        { _id: new ObjectId(args.id_vendedor) },
        {
          $push:{coches: {$each : [{
            id: coche._id.toString(),
            marca: coche.marca,
            matricula: coche.matricula,
            precio: coche.precio,
          }]}}
        }
      );
      const vendedorActualizado = await vendedoresCollection.findOne({ _id: new ObjectId(args.id_vendedor) });
      if(!vendedorActualizado){
        throw new Error("ERROR");
      }
      return {
        id: vendedor._id.toString(),
        nombre: vendedor.nombre,
        apellido: vendedor.apellido,
        coches: vendedorActualizado.coches,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  vendedorAConcesionario: async (
    _: unknown,
    args: { id_vendedor: string; nombre_concesionario: string; ciudad: string}
  ): Promise<Concesionario> => {
    try {
      const vendedor = await vendedoresCollection.findOne({ _id: new ObjectId(args.id_vendedor) });
      if (!vendedor) {
        throw new Error("No existe un vendedor con ese ID");
      }
      const concesionario = await concesionariosCollection.findOne({ nombre: args.nombre_concesionario, ciudad: args.ciudad });
      if (!concesionario) {
        throw new Error("No existe un concesionario con ese nombre en esa ciudad");
      }
      await concesionariosCollection.updateOne(
        { nombre: args.nombre_concesionario, ciudad: args.ciudad },
        {
          $push:{vendedores: {$each : [{
            id: vendedor._id.toString(),
            nombre: vendedor.nombre,
            apellido: vendedor.apellido,
            coches: vendedor.coches,
          }]}}
        }
      );
      const concesionarioActualizado = await concesionariosCollection.findOne({ nombre: args.nombre_concesionario, ciudad: args.ciudad });
      if (!concesionarioActualizado) {
        throw new Error("ERROR");
      }
      return {
        id: concesionario._id.toString(),
        nombre: concesionario.nombre,
        ciudad: concesionario.ciudad,
        vendedores: concesionarioActualizado?.vendedores,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
};
