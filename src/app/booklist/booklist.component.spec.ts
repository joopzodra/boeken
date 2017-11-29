import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { FormsModule } from '@angular/forms'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'

import { BooklistComponent } from './booklist.component'
import { DbService } from '../services/db-service/db.service'
import { MockDbService } from '../testing/mocks-and-stubs/mock.db.service'
import { stubData } from '../testing/mocks-and-stubs/stub-data'
import { Data } from '../models/data'

describe('BooklistComponent', () => {
  let component: BooklistComponent;
  let fixture: ComponentFixture<BooklistComponent>;
  let el: HTMLElement;
  let dbService: DbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        FormsModule,
      ],
      declarations: [BooklistComponent],
      providers: [
        { provide: DbService, useClass: MockDbService }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooklistComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    dbService = TestBed.get(DbService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays a list of books', () => {
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    expect(el.querySelectorAll('li').length).toBe(2);
    expect(el.querySelector('li p:nth-child(1)').textContent).toContain('Book#1');
  });

  it('navigates to a book item when a book in the list is clicked', () => {
    let spy = spyOn((<any>component).router, 'navigate');
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('li').click();
    expect(spy).toHaveBeenCalledWith(['/boek', 1]);
  });

  it('shows a message when no books are stored', () => {
    fixture.whenStable().then(() => {
      dbService.populateError$.next(false);
      expect(true).toBeFalsy();
      expect(el.querySelector('.no-item').textContent).toContain('Er zijn geen boeken');
    });
  });

  it('shows a message when an empty database doesn\'t get not populated', () => {
    dbService.populateError$.next(true)
    fixture.detectChanges();
    expect(el.querySelector('.error').textContent).toContain('probleem met het ophalen');
  });

  it('queries books when the search field receives an input query', async(() => {
    const spy = spyOn(dbService, 'loadBooks');
    fixture.whenStable().then(() => {
      const form = component.form.form;
      const input = form.get('query');
      input.setValue('#1');
      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith(undefined);
        expect(spy).toHaveBeenCalledWith('#1');
      }, 300);
    });
  }));

});
