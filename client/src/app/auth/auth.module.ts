import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AuthRoutingModule } from '../auth/auth-routhing.module';
import { UserService } from '../services/user.service';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [ SignupComponent, LoginComponent, SendEmailComponent ],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AuthRoutingModule,
		RecaptchaModule,
		RecaptchaFormsModule,
		RouterModule,
		MatIconModule,
		MatDialogModule,
		MatButtonModule,
		SharedModule,
	],
	providers: [ UserService ]
})
export class AuthModule {}
