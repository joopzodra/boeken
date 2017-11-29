import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'


import { Book } from '../../models/book'
import { Data } from '../../models/data'
import { LOAD, ADD, EDIT, REMOVE, DataStore } from '../../services/stores/data.store'
import { stubSearchResultItems } from './stub-search-result-items'
import { stubData } from './stub-data'
import { SearchResultItem} from '../../models/search-result-item'

export class MockSearchGoodReadsService {

  searchBooks(query: string): Observable<SearchResultItem[]> {
    return Observable.of(stubSearchResultItems);
  }

  getFullBook(searchResultItem: SearchResultItem): Observable<Book> {
    const mockBook = stubData.books[0];
    return Observable.of(mockBook);
  }

  getAuthor(id: number) {
    const mockAuthor = stubData.authors[0];
    return Observable.of(mockAuthor);
  }

}