import { Routes, RouterModule } from '@angular/router'

import { BooklistComponent } from './booklist/booklist.component'
import { AuthorlistComponent } from './authorlist/authorlist.component'
import { BookPageComponent } from './book-page/book-page.component';
import { AuthorPageComponent } from './author-page/author-page.component'
import { EditBookComponent } from './edit-book/edit-book.component'
import { NewBookComponent } from './new-book/new-book.component'

const appRoutes: Routes = [
  { path: 'boeken', component: BooklistComponent },
  { path: 'schrijvers', component: AuthorlistComponent },
  { path: 'boek/:id', component: BookPageComponent },
  { path: 'schrijver/:id', component: AuthorPageComponent },
  { path: 'boek-wijzig/:id', component: EditBookComponent },
  { path: 'nieuw-boek-zoeken', component: NewBookComponent },
  {
    path: '',
    redirectTo: '/boeken',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/boeken'
  }
]

export const appRouting = RouterModule.forRoot(appRoutes)
export const routingComponents = [BooklistComponent, AuthorlistComponent, BookPageComponent, AuthorPageComponent, EditBookComponent, NewBookComponent]