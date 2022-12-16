import { carsCollection, cochesCollection, vendedoresCollection, concesionariosCollection } from "../db/dbconnection.ts";
import { ObjectId } from "mongo";
import { Car, Coche, Vendedor, Concesionario } from "../types.ts";

export const Query = {
  getCars: async (): Promise<Car[]> => {
    try {
      const cars = await carsCollection.find().toArray();
      return cars.map((car) => ({ ...car, id: car._id.toString() }));
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  getCar: async (_: unknown, args: { id: string }): Promise<Car | null> => {
    try {
      const car = await carsCollection.findOne({ _id: new ObjectId(args.id) });
      if (car) return { ...car, id: car._id.toString() };
      else return null;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  getCoches: async (_: unknown, args: { id?: string, precio_min?: number, precio_max?: number }): Promise<Coche[]> => {
    try {
      const coches = await cochesCollection.find().toArray();
      return coches.map((coche) => ({ ...coche, id: coche._id.toString() }));
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  getVendedores: async (_: unknown, args: { id?: string, nombre?: string, apellido?: string }): Promise<Vendedor[]> => {
    try {
      const vendedores = await vendedoresCollection.find().toArray();
      return vendedores.map((vendedor) => ({ ...vendedor, id: vendedor._id.toString() }));
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  getConcesionarios: async (_: unknown, args: { id?: string, ciudad?: string }): Promise<Concesionario[]> => {
    try {
      const concesionarios = await concesionariosCollection.find().toArray();
      return concesionarios.map((concesionario) => ({ ...concesionario, id: concesionario._id.toString() }));
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};
