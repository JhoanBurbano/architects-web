import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Keys, ROL } from "../enums/global.enum";
import { LocalStorageService } from "../services/local-storage.service";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private toast: ToastrService
  ) {}

  canActivate() {
    const token = this.localStorage.check();
    const rol = this.localStorage.getKey(Keys.ROL);
    if (token && rol) {
      switch (rol) {
        case ROL.ADMIN:
          return true;
        default:
          this.toast.error("you are not authenticated", "Error");
          return this.router.createUrlTree(["/profile"]);
      }
    }
    this.toast.error("you are not authenticated", "Error");
    return this.router.createUrlTree(["/auth/", "login"]);
  }
}
