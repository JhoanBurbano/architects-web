import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { inmuebleI } from 'src/app/models/inmuebles';
import { AsesorService } from 'src/app/services/asesor.service';

@Component({
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.component.html',
  styleUrls: ['./inmuebles.component.scss']
})
export class InmueblesComponent implements OnInit, OnDestroy {

  public inmuebles: inmuebleI[]=[]
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private asesorS: AsesorService, private toast: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.misPublicaciones()
  }

  misPublicaciones(){
    this.asesorS.getMyInm()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data =>{
      this.inmuebles=data
    },err=>{
      this.toast.error(err.message, err.name)
    })
  }

  deleteInmueble(id: string){
    this.asesorS.deleteInm(id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data=>{
      this.toast.success(data.message, 'Done')
    },
    error=>{
      this.toast.error(error.message, error.name)
    })
    this.misPublicaciones()
  }

  editInmueble(_id: string){
    this.router.navigate(['/asesor/post-inmueble/', _id])
  }

  newInmueble(){
    this.router.navigate(['/asesor/post-inmueble'])
  }

  viewInmueble(_id: string){
    this.router.navigate(['inmueble/', _id])
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
