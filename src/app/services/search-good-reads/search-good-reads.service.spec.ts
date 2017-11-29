import { TestBed, inject } from '@angular/core/testing'
import { HttpClient } from '@angular/common/http'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { SearchGoodReadsService } from './search-good-reads.service'
import { stubGoodReadsSearchResponse, stubGoodReadsBookResponse, stubGoodReadsAuthorResponse } from '../../testing/mocks-and-stubs/stub-good-reads-response'
import { stubSearchResultItems } from '../../testing/mocks-and-stubs/stub-search-result-items'
import { stubData } from '../../testing/mocks-and-stubs/stub-data'
import { Book } from '../../models/book'
import { Author } from '../../models/author'

describe('SearchGoodReadsService', () => {

  let service: SearchGoodReadsService;
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        SearchGoodReadsService,
        HttpClient
      ]
    });
  });

  beforeEach(inject([SearchGoodReadsService, HttpClient, HttpTestingController], (_service: SearchGoodReadsService, _httpInj: HttpClient, _httpMockInj: HttpTestingController) => {
    service = _service;
    httpMock = _httpMockInj;
    http = _httpInj;
  }));

  it('should create', () => {
    expect(service).toBeTruthy();
  });


  it('searchBooks method requests and receives xml works from GoodReads and converts them to SearchResultItem\'s', () => {
    const apiUrl = 'http://frontendjr.nl/goodReads/api/search/';
    service.searchBooks('test').subscribe(res => {
      expect(res).toEqual(stubSearchResultItems);
    });
    const req = httpMock.expectOne(apiUrl + 'test');
    expect(req.request.method).toEqual('GET');
    req.flush(stubGoodReadsSearchResponse);
  });

  it('getFullBook request and receives a book from GoodReads and converts it to Book', () => {
    const apiUrl = 'http://frontendjr.nl/goodReads/api/book/';
    const mB = stubData.books[0];
    const expectedBook = new Book(mB.id, mB.authorId, mB.title, mB.year, undefined, undefined, undefined, undefined, mB.description, '', '', 'Author#10')
    service.getFullBook(stubSearchResultItems[0]).subscribe(res => {
      expect(res).toEqual(expectedBook);
    });
    const req = httpMock.expectOne(apiUrl + stubSearchResultItems[0].bookId);
    expect(req.request.method).toEqual('GET');
    req.flush(stubGoodReadsBookResponse);
  });

  it('getAuthor request and receives an author from GoodReads and converts it to Author', () => {
    const apiUrl = 'http://frontendjr.nl/goodReads/api/author/';
    const mA = stubData.authors[0];
    const expectedAuthor = new Author(mA.id, mA.name, '', '')
    service.getAuthor(stubSearchResultItems[0].authorId).subscribe(res => {
      expect(res).toEqual(expectedAuthor);
    });
    const req = httpMock.expectOne(apiUrl + stubSearchResultItems[0].authorId);
    expect(req.request.method).toEqual('GET');
    req.flush(stubGoodReadsAuthorResponse);
  });

});
