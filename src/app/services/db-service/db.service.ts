import { Injectable } from '@angular/core'
import Dexie from 'dexie'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { Database } from '../database/database'
import { Book } from '../../models/book'
import { Author } from '../../models/author'
import { Data } from '../../models/data'
import { LOAD, ADD, EDIT, REMOVE, DataStore } from '../stores/data.store'

@Injectable()
export class DbService {

  private books: Dexie.Table<Book, number>; // number = type of the primkey
  private authors: Dexie.Table<Author, number>;

  public data$: Observable<Data>;
  public populateError$: BehaviorSubject<boolean>;

  constructor(private db: Database, private dataStore: DataStore) {
    this.data$ = this.dataStore.data$;
    this.populateError$ = this.db.populateError$;
    this.db.freshPopulated.then((fresh: boolean) => {
      if (fresh === true) {
        this.loadBooks('');
      }
    });
  }

  public loadBooks(query: string): Dexie.Promise<void> {
    const regex = new RegExp(query, 'i');
    return this.db.books
      .filter(book => {
        return regex.test(book.title);
      })
      .toArray(books => Promise.all(books.map(book => {
        return this.db.authors.get(book.authorId)
          .then(author => book.authorName = author.name)
          .then(() => book)
      })))
      .then(books => this.dataStore.dispatch({
        type: LOAD,
        data: { books: books, authors: [] }
      }))
      .catch(err => console.log(err));
  }

  // the loadBook method contains several if statements to prevent errors when the user gives a non-existing id in the URL of the booklist component
  public loadBook(id: number) {
    const book = this.db.books.get(id);
    const author = book.then(book => book ? this.db.authors.get(book.authorId) : Promise.resolve(new Author(0, '')));
    return Promise.all([book, author])
      .then(([book, author]) => {
        if (book) {
          book.authorName = author.name;
        } else {
          book = new Book(0, 0, '');
        }
        this.dataStore.dispatch({
          type: LOAD,
          data: { books: [book], authors: [] }
        });
      })
      .catch(err => console.log(err));
  }

  public loadAuthors(query: string): Dexie.Promise<void> {
    const regex = new RegExp(query, 'i');
    return this.db.authors
      .filter(author => {
        return regex.test(author.name);
      })
      .toArray()
      .then(authors => this.dataStore.dispatch({
        type: LOAD,
        data: { books: [], authors: authors }
      }))
      .catch(err => console.log(err));
  }

  public loadAuthorBooks(id: number): Promise<void> {
    const author = this.db.authors.get(id);
    const books = this.db.books
      .where('authorId')
      .equals(id)
      .toArray();
    return Promise.all([books, author])
      .then(([books, author]) => this.dataStore.dispatch({
        type: LOAD,
        data: { books: books, authors: [author] }
      }))
      .catch(err => console.log(err));
  }

  public addBook(book: Book, author: Author): Promise<any[]> {
    const storeBook = this.db.books.add(book);
    const storeAuthor = this.db.authors.add(author)
      .catch(err => { if (err.name !== 'ConstraintError') throw err; });
    return Promise.all([storeBook, storeAuthor]);
  }

  public editBook(book: Book): void {
    this.db.books.put(book);
    this.dataStore.dispatch({
      type: EDIT,
      data: book
    });
  }

  public deleteBook(book: Book): Promise<any> {
    const bookDelete = this.db.books.delete(book.id);
    const authorCheck = this.db.books
      .where('authorId')
      .equals(book.authorId)
      .first()
      .then(author => {
        if (!author) {
          this.db.authors.delete(book.authorId);
        }
      })
      .catch(err => console.log(err));
    this.dataStore.dispatch({
      type: REMOVE,
      data: book
    });
    return Promise.all([bookDelete, authorCheck]);
  }

}
