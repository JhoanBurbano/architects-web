import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserTokenInterceptor } from './interceptors/user-token.interceptor';

import { SecurityService } from './services/security.service';
import { UserService } from './services/user.service';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { InmuebleComponent } from './components/inmueble/inmueble.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';


@NgModule({
	declarations: [ 
    AppComponent, 
    HomeComponent, 
    NotFoundComponent, 
	NavbarComponent,
 InmuebleComponent
   ],
	imports: [ 
    BrowserModule, 
    AppRoutingModule, 
    BrowserAnimationsModule, 
    ToastrModule.forRoot(), 
    HttpClientModule,
	RouterModule,
	ReactiveFormsModule,
	SharedModule
	 
],
	providers: [
		SecurityService,
		UserService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: UserTokenInterceptor,
			multi: true
		}
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
