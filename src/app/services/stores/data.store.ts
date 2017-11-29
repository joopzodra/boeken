import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import {Subject } from 'rxjs/Subject'
import { Data } from '../../models/data'
import { Book } from '../../models/book'
import { Author } from '../../models/author'

export const LOAD = 'LOAD'
export const ADD = 'ADD'
export const EDIT = 'EDIT'
export const REMOVE = 'REMOVE'

export class DataStore {
  private data_: Data = { books: [], authors: [] };
  public data$ = new Subject<Data>();
  public dispatch(action: { type: string, data: Data | Book }) {
    this.data_ = this.reduce(this.data_, action);
    this.data$.next(this.data_);
  }
  private reduce(data: Data, action: { type: string, data: Data | Book }) {
    switch (action.type) {
      case LOAD:
        return { books: (<Data>action.data).books, authors: (<Data>action.data).authors };
      case ADD:
        return { books: <Book[]>[...data.books, (<Data>action.data).books], authors: <Author[]>[...data.authors, (<Data>action.data).authors]};
      case EDIT:
        const editedBook: Book = <Book>action.data;
        return {
          books: data.books.map(book => {
            if (book.id !== editedBook.id) {
              return book;
            }
            return editedBook;
          }),
          authors: data.authors
        };
      case REMOVE:
        const deletedBook = (<Book>action.data);
        const books = data.books.filter(book => book.id !== deletedBook.id);
        const authorHasBooks = books.some(book => book.authorId === deletedBook.authorId);
        if (!authorHasBooks) {
          data.authors = data.authors.filter(author => author.id !== deletedBook.authorId);
        }
        return {
          books: books,
          authors: data.authors
        };
      default:
        return data;
    }
  }
}
