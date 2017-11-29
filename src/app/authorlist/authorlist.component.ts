import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { NgForm } from '@angular/forms'
import { Title } from '@angular/platform-browser'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

import { DbService } from '../services/db-service/db.service'
import { Book } from '../models/book'
import { Author } from '../models/author'
import { Data } from '../models/data'
import { sortByName } from '../helpers/sort-by'
import { spinnerString } from '../helpers/spinnerString'

@Component({
  templateUrl: './authorlist.component.html',
  styleUrls: ['./authorlist.component.css']
})
export class AuthorlistComponent implements OnInit, OnDestroy {

  authors$: Observable<Author[]>;
  changeSubscription: Subscription;
  @ViewChild(NgForm) form: NgForm;
  query: string;
  searching = true;
  spinner = spinnerString;

  constructor(private dbService: DbService, private router: Router, private titleService: Title) { }

  ngOnInit() {
    const title = 'Mijn Boeken – Schrijvers';
    this.titleService.setTitle(title);

    this.dbService.loadAuthors('');
    this.authors$ = this.dbService.data$
      .map(data => data.authors)
      .map(authors => authors.sort(sortByName))
      .do(() => this.searching = false);

    this.changeSubscription = this.form.valueChanges
      .do(() => this.searching = true)
      .debounceTime(300)
      .subscribe(form => this.dbService.loadAuthors(form.query));
  }

  onSelect(author: Author) {
    this.router.navigate(['/schrijver', author.id]);
  }

  clearInput() {
    this.form.setValue({query: ''});
  }

  ngOnDestroy() {
    this.changeSubscription.unsubscribe();
  }
}


