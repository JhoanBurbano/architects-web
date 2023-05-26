import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarRoutingModule } from './navbar-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NavbarRoutingModule,
  ], exports:[
    NavbarModule
  ], providers:[
    CookieService,
    Router
  ]
})
export class NavbarModule { }
