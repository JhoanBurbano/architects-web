import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from '../guards/authguard.guard';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';



const routes: Routes = [
    {
        path: '',
        children: [
            {path: 'login', component: LoginComponent},
            {path: 'login/:token', component: LoginComponent},
            {path: 'signup', component: SignupComponent},
            {path: '**', redirectTo: 'login'}
        ],
        canActivate: [AuthguardGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class AuthRoutingModule { }
