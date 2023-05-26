import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsesorService } from '@src/app/services/asesor.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public datos: any = {};
  public rol: any = this.cookie.get('ROL');
  public cards: any = [];
  public isLoadImage: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private profileS: ProfileService,
    private assesor$: AsesorService,
    private toast: ToastrService,
    private cookie: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileS
      .getData()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.datos = data.user;
        this.cards = data.context;
      });
  }

  changeImage(isLoad: boolean) {
    if (isLoad) {
      this.isLoadImage = isLoad;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
