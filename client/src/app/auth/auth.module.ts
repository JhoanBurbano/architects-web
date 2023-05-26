import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from '../auth/auth-routhing.module';
import { UserService } from '../services/user.service';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [ SignupComponent, LoginComponent ],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AuthRoutingModule,
		RecaptchaModule,
		RecaptchaFormsModule,
		RouterModule
	],
	providers: [ UserService ]
})
export class AuthModule {}
