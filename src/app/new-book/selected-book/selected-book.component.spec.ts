import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http'

import { SelectedBookComponent } from './selected-book.component'
import { NewBookComponent } from '../new-book.component'
import { SearchGoodReadsService } from '../../services/search-good-reads/search-good-reads.service'
import { MockSearchGoodReadsService } from '../../testing/mocks-and-stubs/mock-search-good-reads.service'
import { stubSearchResultItems } from '../../testing/mocks-and-stubs/stub-search-result-items'
import { DbService } from '../../services/db-service/db.service'
import { MockDbService } from '../../testing/mocks-and-stubs/mock.db.service'
import { stubData } from '../../testing/mocks-and-stubs/stub-data'

describe('SelectedBookComponent', () => {
  let component: SelectedBookComponent;
  let newBookComponent: NewBookComponent;
  let fixture: ComponentFixture<SelectedBookComponent>;
  let searchGRservice: SearchGoodReadsService;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'boek/1', component: SelectedBookComponent }]), //fake route for test with addBook method
        FormsModule,
        HttpClientModule
        ],
      declarations: [SelectedBookComponent, NewBookComponent],
      providers: [
        { provide: SearchGoodReadsService, useClass: MockSearchGoodReadsService },
        { provide: DbService, useClass: MockDbService }
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedBookComponent);
    component = fixture.componentInstance;
    searchGRservice = TestBed.get(SearchGoodReadsService);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the selected book', () => {
    component.selectedItem = stubSearchResultItems[0];
    fixture.detectChanges();
    expect(el.querySelector('h2').textContent).toBe('Book#1')
  });

  it('navigates back to the new book search results after clicking the \'Go back\' button', () => {
    const newBookCompFixture = TestBed.createComponent(NewBookComponent);
    newBookComponent = newBookCompFixture.componentInstance;
    const newBookCompEl: HTMLElement = newBookCompFixture.nativeElement;
    newBookCompFixture.detectChanges();
    expect(newBookCompEl.querySelector('ul')).toBeFalsy();
    const goBackButton = <HTMLButtonElement>(el.querySelector('button:nth-child(1)'));
    goBackButton.click();
    newBookCompFixture.detectChanges();
    expect(newBookCompEl.querySelector('form')).toBeTruthy();
  });

  it('calls DbService addBook with correct arguments after clicking the save button', fakeAsync(() => {
    const spy = spyOn((<any>component).dbService, 'addBook');
    component.selectedItem = stubSearchResultItems[0];
    fixture.detectChanges();
    const saveButton = <HTMLButtonElement>(el.querySelector('button:nth-child(2)'));
    saveButton.click();
    tick();
    expect(spy).toHaveBeenCalledWith(stubData.books[0], stubData.authors[0]);
  }));

  it('navigates to the new book\'s page after calling DbService addBook', async(() => {
    let spyNav = spyOn((<any>component).router, 'navigate');
    (<any>component).save(stubData.books[0])
      .then(() => {
        expect(spyNav).toHaveBeenCalledWith(['/boek', 1]);
      });
  }));

  it('asks for confirmation if the user wants to save a book that is already in the database', fakeAsync(() => {
    let spy = spyOn((<any>component).dbService, 'addBook').and.returnValue(Promise.reject({name: 'ConstraintError'}));
    component.selectedItem = stubSearchResultItems[0];
    fixture.detectChanges();
    const saveButton = <HTMLButtonElement>(el.querySelector('button:nth-child(2)'));
    saveButton.click();
    tick();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(el.querySelector('p').textContent).toContain('al eerder opgeslagen');
  }));
});
