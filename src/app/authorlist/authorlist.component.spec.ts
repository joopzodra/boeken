import { ComponentFixture, TestBed, async } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { FormsModule } from '@angular/forms'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { AuthorlistComponent } from './authorlist.component'
import { DbService } from '../services/db-service/db.service'
import { MockDbService } from '../testing/mocks-and-stubs/mock.db.service'
import { stubData } from '../testing/mocks-and-stubs/stub-data'
import { Data } from '../models/data'

describe('AuthorlistComponent', () => {
  let component: AuthorlistComponent;
  let fixture: ComponentFixture<AuthorlistComponent>;
  let el: HTMLElement;
  let dbService: DbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        FormsModule,
      ],
      declarations: [AuthorlistComponent],
      providers: [
        { provide: DbService, useClass: MockDbService }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorlistComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    dbService = TestBed.get(DbService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays a list of authors', () => {
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    expect(el.querySelectorAll('li').length).toBe(2);
    expect(el.querySelector('li p').textContent).toContain('Author#10');
  });

  it('navigates to an author item when an author in the list is clicked', () => {
    let spy = spyOn((<any>component).router, 'navigate');
    (<BehaviorSubject<Data>>dbService.data$).next(stubData);
    fixture.detectChanges();
    el.querySelector('li').click();
    expect(spy).toHaveBeenCalledWith(['/schrijver', 10]);
  });

  it('shows a message when no authors are stored', () => {
    (<BehaviorSubject<Data>>dbService.data$).next({ books: [], authors: [] });
    fixture.detectChanges();
    expect(el.querySelector('.no-item').textContent).toContain('Er zijn geen schrijvers');
  });

  it('queries authors when the search field receives an input query', async(() => {
    const spy = spyOn(dbService, 'loadAuthors');
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
