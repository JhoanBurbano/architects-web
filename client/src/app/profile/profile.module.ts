import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { LogoutComponent } from './components/logout/logout.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { UserService } from '../services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { ProfileService } from '../services/profile.service';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    ProfileComponent,
    LogoutComponent,
    MyAccountComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [CookieService, UserService, ProfileService],
})
export class ProfileModule {}
