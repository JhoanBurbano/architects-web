import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientGuard } from '../Guards/client.guard';
import { FavoritesComponent } from './components/favorites/favorites.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'favs', component: FavoritesComponent},
      {path: '**', redirectTo: 'favs'},
    ],
    canActivate: [ClientGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
