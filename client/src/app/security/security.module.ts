import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityRoutingModule } from './security-routing.module';
import { AccountsComponent } from './components/accounts/accounts.component';
import { SecurityService } from '../services/security.service';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  declarations: [
    AccountsComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule
  ], providers:[SecurityService, CookieService]
})
export class SecurityModule { }
