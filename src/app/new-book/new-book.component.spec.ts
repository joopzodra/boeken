import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { Observable } from 'rxjs/Observable'
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http'
import { RouterTestingModule } from '@angular/router/testing'

import { NewBookComponent } from './new-book.component'
import { SelectedBookComponent } from './selected-book/selected-book.component'
import { SearchGoodReadsService } from '../services/search-good-reads/search-good-reads.service'
import { MockSearchGoodReadsService } from '../testing/mocks-and-stubs/mock-search-good-reads.service'
import { stubSearchResultItems } from '../testing/mocks-and-stubs/stub-search-result-items'
import { DbService } from '../services/db-service/db.service'
import { MockDbService } from '../testing/mocks-and-stubs/mock.db.service'

describe('NewBookComponent', () => {

  let component: NewBookComponent;
  let fixture: ComponentFixture<NewBookComponent>;
  let searchGRService: SearchGoodReadsService;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, RouterTestingModule.withRoutes([])],
      declarations: [
        NewBookComponent,
        SelectedBookComponent
      ],
      providers: [
        { provide: SearchGoodReadsService, useClass: MockSearchGoodReadsService },
        { provide: DbService, useClass: MockDbService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBookComponent);
    component = fixture.componentInstance;
    searchGRService = TestBed.get(SearchGoodReadsService);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends a query to SearchGoodReadsService when the input value changes', (done: DoneFn) => {
    const spy = spyOn((<any>component).searchService, 'searchBooks');
    fixture.whenStable().then(() => {
      const form = component.form.form;
      const input = form.get('query');
      input.setValue('Be');
      form.markAsDirty();
      setTimeout(() => {
        expect(spy).not.toHaveBeenCalledWith('Bee');
        expect(spy).toHaveBeenCalledWith('Be');
        done();
      }, 300);
    });
  });

  it('shows a list of search results when it has received search results', () => {
    component.searchResultItems$ = Observable.of(stubSearchResultItems);
    fixture.detectChanges();
    expect(el.querySelectorAll('li').length).toBe(3);
    expect(el.querySelector('li:nth-child(3) p').textContent).toContain('Book#3');
  });

  it('displays an error message when it receives an error from SearchGoodReadsService', (done: DoneFn) => {
    const spy = spyOn((<any>component).searchService, 'searchBooks').and.returnValue(Observable.throw(new HttpErrorResponse({})));
    fixture.whenStable().then(() => {
      const form = component.form.form;
      const input = form.get('query');
      input.setValue('Be');
      form.markAsDirty();
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        expect(component.searchError).toBeTruthy();
        fixture.detectChanges();
        expect(el.querySelector('p').textContent).toContain('mislukt');
        done();
      }, 300);
    });
  });

  it('displays SelectedBookComponent when a search result item is clicked', () => {
    component.searchResultItems$ = Observable.of(stubSearchResultItems);
    fixture.detectChanges();
    expect(el.querySelector('jr-selected-book')).toBeFalsy();
    el.querySelector('li').click();
    fixture.detectChanges();
    expect(el.querySelector('jr-selected-book')).toBeTruthy();
  });

});

