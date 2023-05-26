import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityGuard } from '../Guards/security.guard';
import { AccountsComponent } from './components/accounts/accounts.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: 'accounts', component: AccountsComponent},
      {path: '**', redirectTo: 'accounts'},
    ],
    canActivate: [SecurityGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
