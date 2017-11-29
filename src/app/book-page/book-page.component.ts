import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { Title } from '@angular/platform-browser'

import { Observable } from 'rxjs/Observable'

import { DbService } from '../services/db-service/db.service'
import { Book } from '../models/book'
import { spinnerString } from '../helpers/spinnerString'

@Component({
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css']
})
export class BookPageComponent implements OnInit {

  book$: Observable<Book>
  bookId: number;
  searching = true;
  showDeleteConfirm: boolean = false;
  spinner = spinnerString;

  constructor(private dbService: DbService, private router: Router, private route: ActivatedRoute, private location: Location, private titleService: Title) { }

  ngOnInit() {
    this.bookId = +this.route.snapshot.params.id;
    this.dbService.loadBook(this.bookId);
    this.book$ = this.dbService.data$
      .map(data => data.books[0])
      .do(book => {
        this.searching = false;
        if (book) {
          this.titleService.setTitle('Mijn Boeken – ' + book.title)
        } else {
          this.titleService.setTitle('Mijn Boeken – Niet opgeslagen boek ')
        }
      });
  }

  goToEditBook() {
    this.router.navigate(['/boek-wijzig', this.bookId]);
  }

  goToAuthor(authorId: number) {
    this.router.navigate(['/schrijver', authorId]);
  }

  deleteBook() {
    this.showDeleteConfirm = true;
  }

  confirmDelete(book: Book) {
    this.dbService.deleteBook(book);
    this.location.back();
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }
}
