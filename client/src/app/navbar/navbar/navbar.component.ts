import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Keys } from "@src/app/enums/global.enum";
import { LocalStorageService } from "@src/app/services/local-storage.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  public isLog: boolean = this.localStorage.check();
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
        this.navDinamic();
      }
    });
  }
  constructor(
    private localStorage: LocalStorageService,
    private router: Router
  ) {}

  navDinamic() {
    this.isLog = this.localStorage.check();
    if (this.isLog) {
      this.list = [
        {
          name: `hello, ${this.localStorage.getKey(Keys.USER)}`,
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
    this.localStorage.clearStorage();
    this.navDinamic();
    this.router.navigate(["/"]);
  }
}
