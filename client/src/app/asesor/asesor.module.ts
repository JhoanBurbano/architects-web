import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsesorRoutingModule } from './asesor-routing.module';
import { InmueblesComponent } from './components/inmuebles/inmuebles.component';
import { NewInmbuebleComponent } from './components/new-inmbueble/new-inmbueble.component';
import { AsesorService } from '../services/asesor.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '@shared/shared.module';
import { CapitalizePipe } from '@src/pipes/capitalize.pipe';


@NgModule({
  declarations: [
    InmueblesComponent,
    NewInmbuebleComponent,
    CapitalizePipe
  ],
  imports: [
    CommonModule,
    AsesorRoutingModule,
    ReactiveFormsModule,
    SharedModule

  ], providers:[AsesorService, ToastrService]
})
export class AsesorModule { }
 