import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "../services/local-storage.service";
import { Keys } from "../enums/global.enum";

@Injectable({
  providedIn: "root",
})
export class AuthguardGuard implements CanActivate {
  constructor(
    private router: Router,
    private toast: ToastrService,
    private localStorage: LocalStorageService
  ) {}
  canActivate() {
    const isLogged = this.localStorage.check();
    console.log("AuthGuarg: ", isLogged);
    if (isLogged) {
      this.toast.warning("You are autentified", "REDIRECT");
      return this.router.createUrlTree(["/profile", "board"]);
    }
    return true;
  }
}
