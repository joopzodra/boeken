import { BrowserModule, Title} from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

import { appRouting, routingComponents } from './app.routing'

import { AppComponent } from './app.component'
import { SelectedBookComponent } from './new-book/selected-book/selected-book.component'
import { HeaderComponent } from './header/header.component'

import { DbService } from './services/db-service/db.service'
import { DataStore } from './services/stores/data.store'
import { Database } from './database/database'

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    SelectedBookComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    appRouting,
    FormsModule,
  ],
  providers: [
    DbService,
    DataStore,
    Database,
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
