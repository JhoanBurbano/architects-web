import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "../services/local-storage.service";

@Injectable({
  providedIn: "root",
})
export class UserGuard implements CanActivate {
  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private toast: ToastrService
  ) {}
  canActivate() {
    const isLogged = this.localStorage.check();
    if (!isLogged) {
      this.toast.warning("You are not autentified", "NOT AUTHENTIFIED");
      return this.router.createUrlTree(["/login"]);
    }
    return true;
  }
}
