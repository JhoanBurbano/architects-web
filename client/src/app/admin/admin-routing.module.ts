import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../Guards/admin.guard';
import { ClientsComponent } from './components/clients/clients.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'clients', component: ClientsComponent},
      {path: '**', redirectTo: 'clients'},
    ],
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
