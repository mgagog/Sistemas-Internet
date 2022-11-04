/*Realizar en TypeScript una función que reciba por parámetros un array y devuelva un array modificado, donde cada índice del array será el resultado del producto del resto de elementos del array sin contar el índice actual. Por ejemplo:
Dado el siguiente array: [1, 2, 3] el resultado deberá ser: [ (2*3), (1*3), (1*2) ] .

Información extra a tener en cuenta:

El array puede tener números en formato string, en este caso se deberá convertir a un array de números.

Todas las posibles excepciones deberán ser controladas.

El array pasado por parámetros puede ser un array de arrays, el cual antes de procesarlo deberá ser aplanado, por ejemplo:

[ [ 1, 2, 3 ],  2, [ 4, 5, 6 ] ] => [1,2,3,2,4,5,6]

Se valorará positivamente aquellos alumnos que realicen un nuevo archivo con los test de las funciones siguiendo la documentación oficial de Deno 
*/

const modificarArray = (miArray: any[]): undefined | (number | undefined)[]=> {
  try{
      const arraySinArrays = miArray.flat(Number.MAX_VALUE) // aplanar el array el número mayor de veces que permite el lenguaje

    const arrayMapeado = arraySinArrays.map(elem  => { // mapear el array a uno sin números en formato string
      if (typeof elem === "string" && !isNaN(Number(elem))) {
          return Number(elem); // si es string y no da NaN en la conversión a number, devuelve el dato convertido a number
      }
      else if (typeof elem === "number") {
        return elem; // si el dato es de tipo number, lo devuelve sin más
      }
      else{
        throw new Error("Tipo erróneo de dato"); // si no se cumplen las anteriores condiciones, lanza un error
      }
    })
    const arrayAux = arrayMapeado.slice(); // crea una copia para acceder a los datos inalterados posteriormente
    const arrayFinal = arrayMapeado.map((elem, index) => { // mapear el array a uno donde cada elemento sea el múltiplo del resto de elementos del rray original
    
        const aux: (number | undefined)[] = arrayAux.slice(); // array auxiliar que en cada iteración se igualará a la copia creada anteriormente, para reducir siempre el array original
        aux.splice(index, 1); // se elimina el elemento donde se encuentra la iteración

        return aux.reduce((acc: number | undefined, num: number | undefined) => { // se devuelve el producto de todos los elementos restantes con un reduce
          if (typeof num === "number" && typeof acc === "number") return acc*num;
          else{
            throw new Error("Tipo erróneo de dato");
          }
        }, 1)
    })
    return arrayFinal;
  }
  catch(error){
    console.error(error);
  }
}