import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { BookPageComponent } from '../book-page/book-page.component'
import { DbService } from '../services/db-service/db.service'
import { MockDbService } from '../testing/mocks-and-stubs/mock.db.service'
import { stubData } from '../testing/mocks-and-stubs/stub-data'
import { Data } from '../models/data'

describe('BookPageComponent', () => {
  let component: BookPageComponent;
  let fixture: ComponentFixture<BookPageComponent>;
  let el: any;
  let dbService: DbService;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
      {path: 'boeken', component: BookPageComponent} // fake route, to be used in confirm-delete test
        ])],
      declarations: [BookPageComponent],
      providers: [
        { provide: DbService, useClass: MockDbService },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    })
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookPageComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    dbService = TestBed.get(DbService);
    route = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has content when the routeparams id points to a stored book', () => {
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    const header = el.querySelector('h2');
    expect(el.textContent).toContain('Book#1');
  });

  it('shows a message when the routeparams id doesn\'t point to a stored book', () => {
    (<BehaviorSubject<Data>>dbService.data$).next({ books: [], authors: [] });
    fixture.detectChanges();
    const message = el.querySelector('.no-item');
    expect(message.textContent).toContain('is niet opgeslagen');
  });

  it('navigates to the edit book page after clicking the "Boekinfo wijzigen" button', () => {
    let spy = spyOn((<any>component).router, 'navigate');
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    el.querySelector('.go-to-edit').click();
    expect(spy).toHaveBeenCalledWith(['/boek-wijzig', 1]);
  });

  it('navigates to the author after clicking the "Ga naar schrijver" button', () => {
    let spy = spyOn((<any>component).router, 'navigate');
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    el.querySelector('.go-to-author').click();
    expect(spy).toHaveBeenCalledWith(['/schrijver', 10]);
  });

  it('asks for confirmation to delete the stored book after clicking the delete button', () => {
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    el.querySelector('.delete-book').click();
    fixture.detectChanges();
    expect(el.querySelector('.delete-book')).toBeNull();
    expect(el.querySelector('.confirm-delete')).toBeDefined();
  });

  it('deletes the book after confirmation and navigates back', () => {
    let spy = spyOn(dbService, 'deleteBook');    
    let spyNav = spyOn((<any>component).location, 'back');
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    component.showDeleteConfirm = true;
    fixture.detectChanges();
    el.querySelector('.confirm-delete').click();
    expect(spy).toHaveBeenCalledWith(stubData.books[0]);
    expect(spyNav).toHaveBeenCalled();
  });

});
