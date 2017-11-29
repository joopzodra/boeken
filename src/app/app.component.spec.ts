import { TestBed,  } from '@angular/core/testing'
import {RouterTestingModule} from '@angular/router/testing'

import { AppComponent } from './app.component'
import { HeaderComponent } from './header/header.component'

describe('AppComponent', () => {
  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,
        HeaderComponent
      ],
    }).compileComponents();
  }));
  it('should create', (() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
