import { carsCollection, cochesCollection, vendedoresCollection, concesionariosCollection } from "../db/dbconnection.ts";
import { ObjectId } from "mongo";
import { Car, Coche, Vendedor, Concesionario } from "../types.ts";

export const Query = {
  obtenerCoches: async (_: unknown, args: { id?: string, precio_min?: number, precio_max?: number }): Promise<Coche | Coche[] | null> => {
    try {
      if(args.id){
        const coche = await cochesCollection.findOne(
          {_id: new ObjectId(args.id)}
        );
        if(coche)
          return { ...coche, id: coche._id.toString() };
        else 
          return null;
      }
      else if(args.precio_max || args.precio_min){
        if(!args.precio_max){
          const coches = await cochesCollection.find({ precio: {$gte: args.precio_min}}).toArray();
          return coches.map((coche) => ({ ...coche, id: coche._id.toString() }));
        }
        else if(!args.precio_min){
          const coches = await cochesCollection.find({ precio: {$lte: args.precio_max}}).toArray();
          return coches.map((coche) => ({ ...coche, id: coche._id.toString() }));
        }
        else{
          const coches = await cochesCollection.find({ precio: {$gte: args.precio_min, $lte: args.precio_max}}).toArray();
          return coches.map((coche) => ({ ...coche, id: coche._id.toString() }));
        }
      }
      else{
        const coches = await cochesCollection.find().toArray();
        return coches.map((coche) => ({ ...coche, id: coche._id.toString() }));
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  obtenerVendedores: async (_: unknown, args: { id?: string, nombre?: string, apellido?: string }): Promise<Vendedor | Vendedor[] | null> => {
    try {
      if(args.id){
        const vendedor = await vendedoresCollection.findOne(
          {_id: new ObjectId(args.id)}
        );
        if(vendedor)
          return { ...vendedor, id: vendedor._id.toString() };
        else 
          return null;
      }
      else if(args.apellido || args.nombre){
        if(!args.nombre){
          const vendedores = await vendedoresCollection.find({ apellido: args.apellido }).toArray();
          return vendedores.map((vendedor) => ({ ...vendedor, id: vendedor._id.toString() }));
        }
        else if(!args.apellido){
          const vendedores = await vendedoresCollection.find({ nombre: args.nombre }).toArray();
          return vendedores.map((vendedor) => ({ ...vendedor, id: vendedor._id.toString() }));
        }
        else{
          const vendedores = await vendedoresCollection.find({ nombre: args.nombre, apellido: args.apellido}).limit(10).toArray();
          return vendedores.map((vendedor) => ({ ...vendedor, id: vendedor._id.toString() }));
        }
      }
      else{
        const vendedores = await vendedoresCollection.find().toArray();
        return vendedores.map((vendedor) => ({ ...vendedor, id: vendedor._id.toString() }));
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  obtenerConcesionarios: async (_: unknown, args: { id?: string, ciudad?: string }): Promise<Concesionario | Concesionario[] | null> => {
    try {
      if(args.id){
        const concesionario = await concesionariosCollection.findOne(
          {_id: new ObjectId(args.id)}
        );
        if(concesionario)
          return { ...concesionario, id: concesionario._id.toString() };
        else 
          return null;
      }
      else if(args.ciudad){
        const concesionarios = await concesionariosCollection.find({ ciudad: args.ciudad}).toArray();
        return concesionarios.map((vendedor) => ({ ...vendedor, id: vendedor._id.toString() }));
      }
      else{
        const concesionarios = await concesionariosCollection.find().toArray();
        return concesionarios.map((concesionario) => ({ ...concesionario, id: concesionario._id.toString() }));
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};
