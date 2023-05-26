import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsesorRoutingModule } from './asesor-routing.module';
import { InmueblesComponent } from './components/inmuebles/inmuebles.component';
import { NewInmbuebleComponent } from './components/new-inmbueble/new-inmbueble.component';
import { AsesorService } from '../services/asesor.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    InmueblesComponent,
    NewInmbuebleComponent,
  ],
  imports: [
    CommonModule,
    AsesorRoutingModule,
    ReactiveFormsModule,
    SharedModule

  ], providers:[AsesorService, CookieService, ToastrService]
})
export class AsesorModule { }
 