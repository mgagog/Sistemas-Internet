export type Book = {
id: string;
title: string;
id_author: string;
pages: number;
isbn: string;
};
  
export type Author = {
id: string;
name: string;
books: string[]
};
  
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    cart: string[]
};