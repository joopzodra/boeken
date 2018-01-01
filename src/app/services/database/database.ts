import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'
import Dexie from 'dexie'

import { Book } from '../../models/book'
import { Author } from '../../models/author'
import { Data } from '../../models/data'

@Injectable()
export class Database extends Dexie {

  private sampleBooksFile = 'assets/sample-books.json';
  private sampleAuthorsFile = 'assets/sample-authors.json';
  public books: Dexie.Table<Book, number>; // number = type of the primkey
  public authors: Dexie.Table<Author, number>;

  public populateError$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public freshPopulated: Promise<boolean>;

  constructor(private http: HttpClient) {
    super('dbService');
    this.version(1).stores({
      books: 'id, authorId, title, rating',
      authors: 'id, name'
    });
    let bookCount = this.books.count(count => count > 0);
    let authorCount = this.authors.count(count => count > 0);
    this.freshPopulated = Promise.all([bookCount, authorCount])
      .then(res => {
        if (res[0] === false || res[1] === false) {
          return this.populateDb();
        } else {
          return Promise.resolve(false);
        }
      });
  }

  private populateDb(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sampleBooks = this.http.get<Book[]>(this.sampleBooksFile)
        .map((books) => books.map((book: Book) => new Book(book.id, book.authorId, book.title, book.year, book.rating, book.onReadingList, book.owned, book.lentTo, book.description, book.img, book.imgSmall)));
      const sampleAuthors = this.http.get<Author[]>(this.sampleAuthorsFile)
        .map((authors) => authors.map((author: Author) => new Author(author.id, author.name, author.img, author.imgSmall)));

      const addSamplesToDb = (): void => {
        Observable.forkJoin([sampleBooks, sampleAuthors])
          .subscribe((res: (Book[] | Author[])[]) => {
            Promise.all([this.books.clear(), this.authors.clear()]) // for safety: if the user manually changed the db, then populating can cause errors if an id (which is the primary key) already exists
              .then(() => this.transaction('rw', this.books, this.authors, () => {
                this.books.bulkAdd(<Book[]>res[0]);
                this.authors.bulkAdd(<Author[]>res[1]);
              }))
              .then(() => resolve(true))
          },
          err => {
            console.log(err);
            this.populateError$.next(err);
          });
      }
      this.on('ready', addSamplesToDb);
    });
  }

}