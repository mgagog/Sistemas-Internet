export type Car = {
  id: string;
  brand: string;
  plate: string;
  seats: number;
};
export type Coche = {
  id: string;
  marca: string;
  matricula: string;
  precio: number;
}

export type Vendedor = {
  id: string;
  nombre: string;
  apellido: string;
  coches: Coche[];
}
export type Concesionario = {
  id: string;
  ciudad: string;
  vendedores: Vendedor[];
}