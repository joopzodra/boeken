import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { Book } from '../../models/book'
import { Author} from '../../models/author'
import { Data } from '../../models/data'
import { LOAD, ADD, EDIT, REMOVE, DataStore } from '../../services/stores/data.store'
import { stubData } from './stub-data'

export class MockDbService {
  dataStore = new DataStore();
  data$ = new BehaviorSubject<Data>({ books: [], authors: [] });
  populateError$ = new BehaviorSubject(false);

  loadBooks = (query: string): Promise<void> => {
    const regex = new RegExp(query, 'i');
    const books = stubData.books
      .filter(book => regex.test(book.title))
      .map(book => {
        (<Book>book).authorName = stubData.authors.filter(author => author.id === book.authorId)[0].name;
        return book;
      });
    return Promise.resolve(this.dataStore.dispatch({
      type: LOAD,
      data: { books: books, authors: [] }
    }));
  }

  loadBook(id: number) {
    const author = stubData.authors[0];
    const book = stubData.books[0];
    (<Book>book).authorName = author.name;
    return Promise.resolve(this.dataStore.dispatch({
      type: LOAD,
      data: {books: [book], authors: []}
    }));
  }

  loadAuthors = (query: string): Promise<void> => {
    const authors = stubData.authors
      .filter(author => {
        const regex = new RegExp(query, 'i');
        return regex.test(author.name);
      });
    return Promise.resolve(this.dataStore.dispatch({
      type: LOAD,
      data: { books: [], authors: authors }
    }));
  }

  public loadAuthorBooks(id: number): any {
    const author = stubData.authors.filter(author => author.id === id);
    const books = stubData.books.filter(book => book.authorId === id);
    return Promise.resolve(this.dataStore.dispatch({
      type: LOAD,
      data: { books: books, authors: author }
    }));
  }

  public addBook(book: Book, author: Author) {
    return Promise.resolve(undefined);
   }

  editBook(book: Book) {
    this.dataStore.dispatch({
      type: EDIT,
      data: book
    });
  };

  deleteBook(id: number) { };
}