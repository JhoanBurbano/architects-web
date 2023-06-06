import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AsesorService } from "@src/app/services/asesor.service";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { Subject, catchError, of, switchMap, takeUntil } from "rxjs";
import { ProfileService } from "src/app/services/profile.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public datos: any = {};
  public rol: any = this.cookie.get("ROL");
  public cards: any = [];
  public isLoadImage: boolean = false;
  private unsubscribe$: Subject<void> = new Subject<void>();
  public showPanel = false;
  constructor(
    private profile$: ProfileService,
    private assesor$: AsesorService,
    private toast: ToastrService,
    private cookie: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profile$
      .getFullData()
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((data) => {
          this.datos = data.user;
          return this.assesor$.getPropertiesById(this.datos._id);
        })
      )
      .subscribe((data) => {
        this.cards = data;
      });
  }

  changeImage(isLoad: boolean) {
    if (isLoad) {
      this.isLoadImage = isLoad;
    }
  }

  deleteInmueble(id: string) {
    this.assesor$
      .deleteProperty(id)
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((data) => {
          this.toast.success(data.message, "Done");
          return this.assesor$.getPropertiesById(this.datos._id)
        }),
        catchError((error) => {
          console.log("error", error);
          return of();
        })
      )
      .subscribe((data)=>{
        this.cards = data
      });
  }

  editInmueble(_id: string) {
    console.log('_id edit', _id)
    this.router.navigate(["/asesor/post-inmueble/", _id]);
  }

  newInmueble() {
    this.router.navigate(["/asesor/post-inmueble"]);
  }

  viewInmueble(_id: string) {
    console.log('_id view', _id)
    // this.router.navigate(["inmueble/", _id]);
  }

  onClickToggle(){
    console.log('click', this.showPanel)
    this.showPanel = !this.showPanel
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
