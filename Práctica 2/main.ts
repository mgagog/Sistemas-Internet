import { Application, helpers, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"

const isDNI = (dni: string): boolean => {
  const formato = /^[0-9]{8,8}[A-Za-z]$/;

  return formato.test(dni);
}
const isEmail = (email: string): boolean => {
  const formato = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return formato.test(email);
}

const ibanGenerator = (): string =>{
  const numbers = '0123456789';

  let iban = '';
  let string1 = '';
  let string2 = '';
  let string3 = '';
  let string4 = '';
  let string5 = '';

  for(let i=0; i<2; i++){
    string1 += numbers[Math.floor(Math.random() * numbers.length)];
  }

  for(let i=0; i<4; i++){  
    string2 += numbers[Math.floor(Math.random() * numbers.length)];
    string3 += numbers[Math.floor(Math.random() * numbers.length)];
    string4 += numbers[Math.floor(Math.random() * numbers.length)];
    string5 += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return (iban + 'ES' + string1 + ' ' + string2+ ' ' + string3+ ' ' + string4+ ' ' + string5); 
}


type User = {
    dni: string;
    nombre: string;
    apellidos: string;
    telefono: number;
    email: string;
    iban: string;
    id: string;
};

type Transaction = {
  dni_sender: string;
  dni_receiver: string;
  amount: number;
}

let users: User[] = [];
const transactions: Transaction[] = [];

const router = new Router();
router
  .get("/", (ctx) => {
    try {
      ctx.response.body = [users, transactions];
      ctx.response.status = 200;
    } catch (e) {
      console.error(e);
      ctx.response.body = {
        error: e,
        message: "Internal Server Error",
      };
    }
  })
  .get("/getUser/:param", (ctx) => {
    try {
      if (ctx.params?.param) {
        const user: User | undefined = users.find((user) => {
          return ((user.email === ctx.params.param) ||

          (user.iban === ctx.params.param) ||

          (user.dni === ctx.params.param) ||
          
          (user.id === ctx.params?.param) ||

          (user.telefono === Number(ctx.params?.param)))
        }
        );
  
        if (user) {
          ctx.response.body = user;
          ctx.response.status = 200;
          return;
        }
      }

      ctx.response.body = "No se encontró al usuario";
      ctx.response.status = 404;

    } catch (e) {
      console.error(e);
      ctx.response.body = {
        error: e,
        message: "Internal Server Error",
      };
    }
  })
  .post("/addUser", async (ctx) => {
    try {
      const result = ctx.request.body({ type: "json" });
      const value = await result.value;
      let new_iban: string;

      if (!value?.dni || !value?.nombre || !value?.apellidos ||
        !value?.telefono || !value?.email) {
        ctx.response.body = "Error: faltan campos por rellenar";
        ctx.response.status = 400;
        return;
      }
      if (!isDNI(value?.dni) || !isEmail(value?.email)) {
        ctx.response.body = "Error: Email o DNI no válidos";
        ctx.response.status = 400;
        return;
      }
      if(users.some((user) => user.email=== value.email) ||
        users.some((user) => user.dni=== value.dni) ||
        users.some((user) => user.telefono=== value.telefono)){
        ctx.response.body = "Error: DNI, Email o número de teléfono repetidos"
        ctx.response.status = 400;
        return;
      }
      do {
        new_iban = ibanGenerator();
      } while (users.some((user) => user.iban === new_iban));

      const user: User = {
        id: new Date().toISOString(),
        nombre: value?.nombre,
        apellidos: value?.apellidos,
        dni: value?.dni,
        telefono: value?.telefono,
        email: value?.email,
        iban: new_iban
      };
      users.push(user);
      ctx.response.body = "Usuario añadido correctamente";
      ctx.response.status = 200;

    } catch (e) {
      console.error(e);
      ctx.response.body = {
        error: e,
        message: "Internal Server Error",
      };
    }
  })
  .delete("/deleteUser/:email", (ctx) => {
    try {
      if (
        ctx.params?.email &&
        users.some((user) => user.email === ctx.params?.email)) {
        users = users.filter((user) => user.email !== ctx.params?.email);
        ctx.response.body = "Usuario eliminado correctamente"
        ctx.response.status = 200;
        return;
      }
      ctx.response.body = "No se ha encontrado al usuario"
      ctx.response.status = 404;
    } catch (e) {
      console.error(e);
      ctx.response.body = {
        error: e,
        message: "Internal Server Error",
      };
    }
  })
  .post("/addTransaction", async (ctx) => {
    try {
      const result = ctx.request.body({ type: "json" });
      const value = await result.value;
      if (!value?.dni_receiver || !value?.dni_sender || !value?.amount) {
        ctx.response.body = "Error: faltan campos por rellenar";
        ctx.response.status = 400;
        return;
      }
      if(!users.some((user) => user.dni=== value.dni_sender) ||
        !users.some((user) => user.dni=== value.dni_receiver)){
        ctx.response.body = "Uno o los dos usuarios no están registrados";
        ctx.response.status = 404;
        return;
      }

      const transaction: Transaction = {
        dni_sender: value?.dni_sender,
        dni_receiver: value?.dni_receiver,
        amount: value?.amount
      };
      transactions.push(transaction);
      ctx.response.body = "Transacción añadida correctamente";
      ctx.response.status = 200;

    } catch (e) {
      console.error(e);
      ctx.response.body = {
        error: e,
        message: "Internal Server Error",
      };
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });