import { Book } from '../models/book'
import {Author} from '../models/author'

  export const sortByAuthorAndYear = (a: Book, b: Book) => {
    return a.authorName < b.authorName ? -1 : a.authorName > b.authorName ? 1 :
      a.year < b.year ? -1 : a.year > b.year ? 1 : 0;
  }

/*  export const sortByRatingAndTitle = (a: Book, b: Book) => {
    return a.rating < b.rating ? 1 : a.rating > b.rating ? -1 :
        a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
  }*/

  export const sortByYear = (a: Book, b: Book) => a.year > b.year ? 1 : 0;

  export const sortByName = (a: Author, b: Author) => a.name > b.name ? 1 : 0;
