import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'

import { SearchResultItem } from '../../models/search-result-item'
import { Book } from '../../models/book'
import { Author } from '../../models/author'
import { XmlTextFinder } from '../../helpers/xml-text-finder'

@Injectable()
export class SearchGoodReadsService {

  private apiUrl = 'https://frontendjr.nl/goodReads/api/';
  private goodReadsNoPhoto = 'https://s.gr-assets.com/assets/nophoto';
  private noPhotoLength = this.goodReadsNoPhoto.length;

  constructor(private http: HttpClient) { }

  private parseSearchResponse(response: string): SearchResultItem[] {
    const searchResultItem = (work: any) => {
      const finder = () => new XmlTextFinder(work);
      const title = finder().find('title').text();
      const bookId = +finder().find('best_book').find('id').text();
      const authorName = finder().find('author').find('name').text();
      const authorId = +finder().find('author').find('id').text();
      let smallImgUrl = finder().find('small_image_url').text();
      smallImgUrl.substr(0, this.noPhotoLength) === this.goodReadsNoPhoto ?
        smallImgUrl = 'assets/book-s.jpg' :
        smallImgUrl = smallImgUrl;
      return { title: title, bookId: bookId, authorName: authorName, authorId: authorId, smallImgUrl: smallImgUrl }
    };
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response, 'text/xml');
    const works = xmlDoc.getElementsByTagName('work');
    return Array.prototype.slice.call(works)
      .map((work: any) => searchResultItem(work));
  }

  private parseFullBookResponse(response: string, searchResultItem: SearchResultItem): Book {
    const book = (book: any) => {
      const finder = () => new XmlTextFinder(book);
      const description = finder().find('description').text();
      const year = +finder().find('original_publication_year').text();
      let imgUrl = finder().find('image_url').text();
      imgUrl.substr(0, this.noPhotoLength) === this.goodReadsNoPhoto ?
        imgUrl = 'assets/book-m.jpg' :
        imgUrl = imgUrl;
      // book request can have small img even when search result has nophoto, so get new smallImgUrl value 
      let smallImgUrl = finder().find('small_image_url').text();
      smallImgUrl.substr(0, this.noPhotoLength) === this.goodReadsNoPhoto ?
        smallImgUrl = 'assets/book-s.jpg' :
        smallImgUrl = smallImgUrl;
      return new Book(searchResultItem.bookId, searchResultItem.authorId, searchResultItem.title, year, undefined, undefined, undefined, undefined, description, imgUrl, smallImgUrl, searchResultItem.authorName);
    };

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response, 'text/xml');
    const bookElement = xmlDoc.getElementsByTagName('book').item(0);
    return book(bookElement);
  }

  private parseAuthorResponse(response: string, id: number) {
    const author = (author: any) => {
      const finder = () => new XmlTextFinder(author);
      const name = finder().find('name').text();
      let smallImgUrl = finder().find('small_image_url').text();
      smallImgUrl.substr(0, this.noPhotoLength) === this.goodReadsNoPhoto ?
        smallImgUrl = 'assets/persoon-s.jpg' :
        smallImgUrl = smallImgUrl;
      let imgUrl = finder().find('image_url').text();
      imgUrl.substr(0, this.noPhotoLength) === this.goodReadsNoPhoto ?
        imgUrl = 'assets/persoon-m.jpg' :
        imgUrl = imgUrl;
      return new Author(id, name, imgUrl, smallImgUrl);
    };
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response, 'text/xml');
    const authorElement = xmlDoc.getElementsByTagName('author').item(0);
    return author(authorElement);
  }

  public searchBooks(query: string): Observable<SearchResultItem[]> {
    return this.http
      .get(this.apiUrl + 'search/' + query, { responseType: 'text' })
      .map(res => this.parseSearchResponse(res));
  }

  public getFullBook(searchResultItem: SearchResultItem): Observable<Book> {
    const id = searchResultItem.bookId;
    return this.http
      .get(this.apiUrl + 'book/' + id, { responseType: 'text' })
      .map(res => this.parseFullBookResponse(res, searchResultItem));
  }

  public getAuthor(id: number): Observable<Author> {
    return this.http
      .get(this.apiUrl + 'author/' + id, { responseType: 'text' })
      .map(res => this.parseAuthorResponse(res, id));
  }

}
