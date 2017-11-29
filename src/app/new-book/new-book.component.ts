import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { HttpErrorResponse } from '@angular/common/http'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'

import { SearchGoodReadsService } from '../services/search-good-reads/search-good-reads.service'
import { SearchResultItem } from '../models/search-result-item'
import { spinnerString } from '../helpers/spinnerString'

@Component({
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.css'],
  providers: [SearchGoodReadsService]
})
export class NewBookComponent implements OnInit {

  searchResultItems$: Observable<SearchResultItem[]>;
  searchError = false;
  searching = false;
  selectedItem: SearchResultItem;
  @ViewChild(NgForm) form: NgForm;
  query: string;
  @Output('bookSelected') bookSelected: EventEmitter<any>;
  routeParams: Subscription;
  emptySearchResultItems = new Subject<undefined>();
  spinner = spinnerString;

  constructor(private searchService: SearchGoodReadsService, private titleService: Title) {
    this.bookSelected = new EventEmitter();
  }

  ngOnInit() {
    this.titleService.setTitle('Mijn Boeken – Nieuw boek zoeken');
    this.searchResultItems$ = this.form.valueChanges
      .debounceTime(300)
      .filter(() => this.form.dirty)
      .do(() => this.searchError = false)
      .do(() => this.searching = true)
      .switchMap(form => this.searchService.searchBooks(form.query))
      .merge(this.emptySearchResultItems)
      .do(() => this.searching = false)
      .catch((err: HttpErrorResponse) => {
        this.searchError = true;
        this.searching = false;
        return Observable.of([]);
      });
  }

  select(item: SearchResultItem) {
    this.selectedItem = item;
  }

  deselect(event: undefined) {
    this.selectedItem = undefined;
  }

  clearInput() {
    this.emptySearchResultItems.next(undefined);
    this.form.reset();
  }
}
