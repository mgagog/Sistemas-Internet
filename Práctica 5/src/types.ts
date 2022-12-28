export type Usuario = {
  id: string;
  username: string;
  password: string;
  mensajes_enviados: Mensaje[];
  mensajes_recibidos: Mensaje[];
  idioma: string;
  token?: string;
}
export type Mensaje = {
  id: string;
  emisor: string;
  receptor: string;
  fecha: string;
}