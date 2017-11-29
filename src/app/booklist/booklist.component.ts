import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core'
import { Router } from '@angular/router'
import { NgForm } from '@angular/forms'
import { Title } from '@angular/platform-browser'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

import { DbService } from '../services/db-service/db.service'
import { Book } from '../models/book'
import { Author } from '../models/author'
import { Data } from '../models/data'
import { sortByAuthorAndYear } from '../helpers/sort-by'
import { spinnerString } from '../helpers/spinnerString'

@Component({
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BooklistComponent implements OnInit, OnDestroy {

  books$: Observable<Book[]>;
  populateError$: Observable<boolean>;
  errorSubscription: Subscription;
  changeSubscription: Subscription;
  @ViewChild(NgForm) form: NgForm;
  query: string;
  searching = true;
  spinner = spinnerString;

  constructor(private dbService: DbService, private router: Router, private titleService: Title) { }

  ngOnInit() {
    const title = 'Mijn Boeken – Boeken';
    this.titleService.setTitle(title);

    this.books$ = this.dbService.data$
      .map(data => data.books)
      .map(books => books.sort(sortByAuthorAndYear))
      .do(() => this.searching = false)

    this.populateError$ = this.dbService.populateError$;

    this.changeSubscription = this.form.valueChanges
      .do(() => this.searching = true)
      .debounceTime(300)
      .subscribe(form => {
        this.dbService.loadBooks(form.query);
      });
  }

  onSelect(book: Book) {
    this.router.navigate(['/boek', book.id]);
  }

  clearInput() {
    this.form.setValue({ query: '' });
  }

  ngOnDestroy() {
    this.changeSubscription.unsubscribe();
  }

}
