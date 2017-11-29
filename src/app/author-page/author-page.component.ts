import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Title } from '@angular/platform-browser'

import { Observable } from 'rxjs/Observable'

import { DbService } from '../services/db-service/db.service'
import { Book } from '../models/book'
import { Data } from '../models/data'
import { sortByYear } from '../helpers/sort-by'
import { spinnerString } from '../helpers/spinnerString'

@Component({
  templateUrl: './author-page.component.html',
  styleUrls: ['./author-page.component.css']
})
export class AuthorPageComponent implements OnInit {

  authorData$: Observable<Data>;
  searching = false;
  spinner = spinnerString;

  constructor(private dbService: DbService, private router: Router, private route: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {
    let authorId = +this.route.snapshot.params.id;
    this.dbService.loadAuthorBooks(authorId);
    this.authorData$ = this.dbService.data$
      .do(() => this.searching = true)
      .map(data => ({ books: data.books.sort(sortByYear), authors: data.authors }))
      .do(data => {
        this.searching = false;
        if (data.authors.length) {
          this.titleService.setTitle('Mijn Boeken – ' + data.authors[0].name);
        }
      });
  }

  onSelect(book: Book) {
    this.router.navigate(['/boek', book.id]);
  }

}
