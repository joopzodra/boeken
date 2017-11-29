import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ActivatedRoute } from '@angular/router'
import { FormsModule } from '@angular/forms'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { DbService } from '../services/db-service/db.service'
import { MockDbService } from '../testing/mocks-and-stubs/mock.db.service'
import { stubData } from '../testing/mocks-and-stubs/stub-data'
import { Data } from '../models/data'
import { dispatchEvent, setInputValue } from '../testing/test-helper'
import { EditBookComponent } from './edit-book.component'
import { Book } from '../models/book'

describe('EditBookComponent', () => {
  let component: EditBookComponent;
  let fixture: ComponentFixture<EditBookComponent>;
  let el: HTMLElement;
  let dbService: DbService;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), FormsModule],
      declarations: [EditBookComponent],
      providers: [
        { provide: DbService, useClass: MockDbService },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
    dbService = TestBed.get(DbService);
    route = TestBed.get(ActivatedRoute);

    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has content when the routeparams id points to a stored book', () => {
    expect(el.querySelector('h2').textContent).toContain('Book#1');
  });

  it('shows a message when the routeparams id doesn\'t point to a stored book', () => {
    (<BehaviorSubject<Data>>dbService.data$).next({ books: [], authors: [] });
    fixture.detectChanges()
    expect(el.querySelector('.no-item').textContent).toContain('is niet opgeslagen');
  });

  it('saves the edit and navigates back to the book after submitting', async(() => {
    const spyUpdate = spyOn(dbService, 'editBook');
    const spyNav = spyOn((<any>component).router, 'navigate');
    const editedBook = new Book(1, 10, 'Book#1', 1997, 3, false, true, '', 'nice book', 'assets/book-m.jpg', 'assets/book-s.jpg', undefined );
    fixture.autoDetectChanges(true);
    fixture.whenStable().then(() => {
      const form = component.form.form;
      const ratingControl = form.get('rating');
      ratingControl.setValue('3');
      const descriptionControl = form.get('description');
      descriptionControl.setValue('nice book');
      component.editBook(stubData.books[0], form.value);
      expect(spyUpdate).toHaveBeenCalledWith(editedBook); 
      expect(spyNav).toHaveBeenCalledWith(['/boek', 1]);
    });
  }));

  // alternative with ɵgetDOM from '@angular/platform-browser' – better since it changes the form from the surface, but not an official Angular testing tool, so maybe not futureproof!
  it('saves the edit and navigates back to the book after submitting (ALT: test uses ɵgetDOM)', async(() => {
    const spyUpdate = spyOn(dbService, 'editBook').and.callThrough();
    const spyNav = spyOn((<any>component).router, 'navigate');
    const editedBook = new Book(1, 10, 'Book#1', 1997, 3, false, true, '', 'nice book', 'assets/book-m.jpg', 'assets/book-s.jpg', undefined );
    fixture.autoDetectChanges(true);
    fixture.whenStable().then(() => {
      const rating3 = <HTMLInputElement>el.querySelector('input[type="radio"][value="3"]'); 
      rating3.checked = true;
      dispatchEvent(rating3, 'change');
      const description = el.querySelector('textarea');
      description.value = 'nice book';
      dispatchEvent(description, 'input');
      const submit = <HTMLButtonElement>el.querySelector('.submit');
      submit.click();
      expect(spyUpdate).toHaveBeenCalledWith(editedBook);
      expect(spyNav).toHaveBeenCalledWith(['/boek', 1]);
    });
  }));

  it('navigates back to the book after clicking the cancel button', () => {
    let spy = spyOn((<any>component).router, 'navigate');
    (<HTMLButtonElement>el.querySelector('.cancel')).click();
    expect(spy).toHaveBeenCalledWith(['/boek', 1]);
  });

});
