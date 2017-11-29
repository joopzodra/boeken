import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { Router } from '@angular/router'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

import { SearchGoodReadsService } from '../../services/search-good-reads/search-good-reads.service'
import { DbService } from '../../services/db-service/db.service'
import { SearchResultItem } from '../../models/search-result-item'
import { Book } from '../../models/book'
import { spinnerString } from '../../helpers/spinnerString'

@Component({
  selector: 'jr-selected-book',
  templateUrl: './selected-book.component.html',
  styleUrls: ['./selected-book.component.css']
})
export class SelectedBookComponent implements OnInit {

  @Input() selectedItem: SearchResultItem;
  @Output() deselectItem: EventEmitter<undefined>;
  book$: Observable<Book | {}>;
  searchError = false;
  confirmSave = false;
  spinner = spinnerString;

  constructor(private searchService: SearchGoodReadsService, private dbService: DbService, private router: Router) {
    this.deselectItem = new EventEmitter();
  }

  ngOnInit() {
    this.book$ = this.searchService.getFullBook(this.selectedItem)
      .do(() => this.searchError = false)
      .catch((err: HttpErrorResponse) => {
        this.searchError = true;
        return Observable.of({})
      });
  }

  deselect() {
    this.deselectItem.next(undefined);
  }

  save(book: Book): Promise<boolean | void> {
    return this.searchService.getAuthor(book.authorId)
      .toPromise()
      .then(author => this.dbService.addBook(book, author))
      .then(() => this.router.navigate(['/boek', book.id]))
      .catch(err => {
        if (err.name === 'ConstraintError') {
          this.confirmSave = true;
        } else {
          this.searchError = true;
          console.log(err);
        }
      });
  }

  cancelSave() {
    this.confirmSave = false;
  }

  saveConfirmed(book: Book) {
    this.dbService.deleteBook(book)
      .then(() => this.save(book));
  }

}
