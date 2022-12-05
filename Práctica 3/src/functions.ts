import { BookSchema} from "./db/schemas.ts";

export const isEmail = (email: string): boolean => {
    const formato = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    return formato.test(email);
}

export const isObjectId = (id: string): boolean => {
  const formato = /^[0-9a-fA-F]{24}$/;

  return formato.test(id);
}

export const isbnGenerator = (books: BookSchema[]): string =>{ //3 2 5 3 1
    const numbers = '0123456789';
    let isbn: string;
    let string1;
    let string2;
    let string3;
    let string4;
    let string5;

    do{
        isbn = '';
        string1 = '';
        string2 = '';
        string3 = '';
        string4 = '';
        string5 = '';

        for(let i=0; i<3; i++){
            string1 += numbers[Math.floor(Math.random() * numbers.length)];
            string4 += numbers[Math.floor(Math.random() * numbers.length)];
        }
        
        for(let i=0; i<2; i++){  
            string2 += numbers[Math.floor(Math.random() * numbers.length)];
        }

        for(let i=0; i<5; i++){
            string3 += numbers[Math.floor(Math.random() * numbers.length)];
        }
        string5 += numbers[Math.floor(Math.random() * numbers.length)];

        isbn += string1 + ' ' + string2+ ' ' + string3+ ' ' + string4+ ' ' + string5;

    }while(books.find(elem => elem.isbn === isbn));

    return (isbn + string1 + ' ' + string2+ ' ' + string3+ ' ' + string4+ ' ' + string5); 
}
export const encodeDecode = (s: string) => {
    let nstr = ''

    for (let i=0; i <  s.length; i++) {
        nstr += String.fromCharCode(s.charCodeAt(i) ^ 1);
    }

    return nstr;
};