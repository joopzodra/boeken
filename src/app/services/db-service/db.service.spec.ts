import { async, fakeAsync, tick } from '@angular/core/testing'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import Dexie from 'dexie'
import 'rxjs/Rx'

import { DbService } from './db.service'
import { Database } from '../../database/database'
import { DataStore, LOAD } from '../stores/data.store'
import { stubData, stubNewBook, stubNewAuthor } from '../../testing/mocks-and-stubs/stub-data'
import { Book } from '../../models/book'

(<any>stubData.books[0]).authorName = 'Author#10';
(<any>stubData.books[1]).authorName = 'Author#10';

describe('DbService and DataStore', () => {

  let dbService: any;

  beforeEach((done: DoneFn) => {
    dbService = new DbService(new Database(<any>{}), new DataStore());

    dbService.db.books.clear()
      .then(() => dbService.db.books.bulkAdd(stubData.books))
      .then(() => dbService.db.authors.clear())
      .then(() => dbService.db.authors.bulkAdd(stubData.authors))
      .then(() => done());
  });

  it('should create', () => {
    expect(dbService).toBeTruthy();
    expect(new DataStore()).toBeTruthy();
  });

  it('DataStore receives data from DbService', (done: DoneFn) => {
    dbService.loadBooks('')
      .then(() => {
        expect(dbService.dataStore.data_).toEqual({ books: stubData.books, authors: [] });
        done();
      });
  });

  it('after DataStore receives data it emits a data object to DbService', () => {
    dbService.data$.subscribe((emittedData: any) => {
      let data = emittedData;
      expect(data.books[0].id).toBe(1);
      expect(data.books[1].id).toBe(2);
      expect(data.books[2]).toBeUndefined();
    });
    dbService.dataStore.data$.next(stubData);
  });

  it('stores new books in the database, including the author', (done: DoneFn) => {
    dbService.addBook(stubNewBook, stubNewAuthor);
    let checkBook = dbService.db.books.get(3);
    let checkAuthor = dbService.db.authors.get(30);
    Promise.all([checkBook, checkAuthor])
      .then(([book, author]) => {
        expect(book.title).toBe('Book#3');
        expect(author.name).toBe('Author#30');
        done();
      });
  });

  it('DbService stores edited books in the database', (done: DoneFn) => {
    let data = dbService.dataStore.data_ = stubData;
    const editedBook = new Book(1, 10, 'Book#1', 1997, 3, false, true, '', 'NewDescription');
    dbService.editBook(editedBook);
    dbService.db.books.get(1)
      .then((book: Book) => {
        expect(book.rating).toBe(3);
        expect(book.description).toBe('NewDescription');
        done();
      });
  });

  it('DbService sends edited books to DataStore and receives updated data from DataStore', () => {
    let data = dbService.dataStore.data_ = stubData;
    const editedBook = new Book(1, 10, 'Book#1', 1997, 3, false, true, '', 'NewDescription');
    dbService.data$.subscribe((updatedData: any) => {
      expect(updatedData.books[0].rating).toBe(3);
      expect(updatedData.books[0].description).toBe('NewDescription');
    });
    dbService.editBook(editedBook);
  });

  it('deletes on request a book from the database and updates the data object', (done: DoneFn) => {
    let data = dbService.dataStore.data_ = stubData;
    dbService.dataStore.data$.next(stubData);
    const id = 1;
    dbService.data$.subscribe((updatedData: any) => data = updatedData);
    dbService.deleteBook(stubData.books[0])
      .then(() => {
        expect(data.books.length).toBe(1);
        done();
      });
  });

});
