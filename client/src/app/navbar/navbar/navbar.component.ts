import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  public isLog: boolean = this.cookieService.check("ACCESS_TOKEN");
  public title = "Architect";
  public list: any[] = [
    {
      name: "Login",
      url: "/auth/login",
      icon: "fas fa-user",
    },
    {
      name: "Signup",
      url: "/auth/signup",
      icon: "fas fa-user",
    },
  ];
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navDinamic(
          this.cookieService.get("ACCESS_TOKEN"),
          this.cookieService.get("USER"),
          this.cookieService.get("ROL")
        );
        this.isLog= this.cookieService.check("ACCESS_TOKEN");
      }
    });
  }
  constructor(private cookieService: CookieService, private router: Router) {}

  navDinamic(token: string | null, name: string | null, rol: string | null) {
    if (token && name && rol) {
      this.list = [
        {
          name: `hello, ${name}`,
          url: "/profile/board",
          icon: "fas fa-clipboard",
        },
        {
          name: "Profile",
          url: "/profile/my-account",
          icon: "fas fa-id-badge",
        },
      ];
    } else {
      this.list = [
        {
          name: "Login",
          url: "/auth/login",
          icon: "fas fa-user",
        },
        {
          name: "Signup",
          url: "/auth/signup",
          icon: "fas fa-user-plus",
        },
      ];
    }
  }

  async logout() {
    this.router.navigate(["/"]);
    this.cookieService.delete("ACCESS_TOKEN", "/", "localhost", false, "None");
    this.cookieService.delete("USER", "/", "localhost", false, "None");
    this.cookieService.delete("ROL", "/", "localhost", false, "None");
    this.navDinamic(null, null, null);
    this.isLog = false;
    location.reload();
  }
}
