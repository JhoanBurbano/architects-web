import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from '../guards/user-guard.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {path: '',
    children:[
      {path: 'board', component: ProfileComponent},
      {path: 'my-account', component: MyAccountComponent},
      {path: 'edit-account/:id', component: MyAccountComponent},
      {path: 'logout', component: LogoutComponent},
      {path: '**', redirectTo: 'board', canActivate:[UserGuard]},
    ], 
      canActivate: [UserGuard]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
