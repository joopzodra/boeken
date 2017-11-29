import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ActivatedRoute } from '@angular/router'
import { DebugElement } from '@angular/core'
import { By } from '@angular/platform-browser'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { AuthorPageComponent } from '../author-page/author-page.component'
import { DbService } from '../services/db-service/db.service'
import { MockDbService } from '../testing/mocks-and-stubs/mock.db.service'
import { stubData } from '../testing/mocks-and-stubs/stub-data'
import { Data } from '../models/data'

describe('AuthorPageComponent', () => {
  let component: AuthorPageComponent;
  let fixture: ComponentFixture<AuthorPageComponent>;
  let de: DebugElement;
  let dbService: DbService;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [AuthorPageComponent],
      providers: [
        { provide: DbService, useClass: MockDbService },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '10' } } } }
      ]
    })
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorPageComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    dbService = TestBed.get(DbService);
    route = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the author', (() => {
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    expect(de.query(By.css('h2')).nativeElement.textContent).toContain('Author#1');
  }));

  it('shows a message when the routeparams id doesn\'t point to a stored author', () => {
    (<BehaviorSubject<Data>>dbService.data$).next({books: [], authors:[]});
    fixture.detectChanges();
    let el = de.query(By.css('.no-item')).nativeElement;
    expect(el.textContent).toContain('De schrijver die je zoekt');
  });

  it('displays the author\'s books', () => {
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    expect(de.nativeElement.querySelectorAll('li').length).toBe(2);
    expect(de.nativeElement.querySelector('li p').textContent).toContain('Book#1');
  });

  it('shows a message when no author\'s books are stored', () => {
    let mockAuthor = { "id": 10, "name": "Author#10", "img": "", "imgSmall": "" };
    (<BehaviorSubject<Data>>dbService.data$).next({books: [], authors:[mockAuthor]});
    fixture.detectChanges()
    let el = de.query(By.css('.no-item')).nativeElement;
    expect(el.textContent).toContain('Er zijn geen boeken');
  });

  it('navigates to the book item after clicking a book in the list of the author\'s books', () => {
    let spy = spyOn((<any>component).router, 'navigate');
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('li').click();
    expect(spy).toHaveBeenCalledWith(['/boek', 1]);
  });

});
