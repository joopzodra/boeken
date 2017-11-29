import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgForm } from '@angular/forms'
import { Title } from '@angular/platform-browser'

import { Observable } from 'rxjs/Observable'

import { DbService } from '../services/db-service/db.service'
import { Book } from '../models/book'
import { spinnerString } from '../helpers/spinnerString'

@Component({
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  
  book$: Observable<Book>;
  bookId: number;
  searching = true;
  @ViewChild(NgForm) form: NgForm;
  spinner = spinnerString;

  constructor(private dbService: DbService, private router: Router, private route: ActivatedRoute, private titleService: Title) { }

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

  editBook(book: Book, form: {rating: string, onReadingList: boolean, owned: boolean, lentTo: string, description: string} ) { 
    let editedBook = new Book(
      book.id,
      book.authorId,
      book.title,
      book.year,
      +form.rating,
      form.onReadingList,
      form.owned,
      form.lentTo,
      form.description,
      book.img,
      book.imgSmall
      );
    this.dbService.editBook(editedBook);
    this.back();
    return editedBook;
  }

  back() {
    this.router.navigate(['/boek', this.bookId]);
    return false;
  }

}
