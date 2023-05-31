import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "@src/environments/environment";
import { ToastrService } from "ngx-toastr";
import { Subject, catchError, of, takeUntil } from "rxjs";
import { LoginI } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public SITE_KEY = environment.RECAPTCHA_SITE_KEY;
  public token: string;
  public isRecoveryPassword = false;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _userService: UserService,
    private userService: UserService,
    private activeR: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      captcha: [null, Validators.required],
    });
    this.token = this.activeR.snapshot.params["token"];
  }
  ngOnInit(): void {
    this.verifyToken();
  }

  verifyToken() {
    if (this.token) {
      this.userService
        .verifyToken(this.token)
        .pipe(
          takeUntil(this.unsubscribe$),
          catchError(() => {
            this.router.navigate(["/auth/login"]);
            return of();
          })
        )
        .subscribe((isValid: boolean) => {
          if (isValid) {
            this.isRecoveryPassword = true;
            this.loginForm = this.fb.group(
              {
                password: [
                  "",
                  [
                    Validators.pattern(
                      /^(?=.*\d)(?=.*[!@#$.%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/
                    ),
                  ],
                ],
                confirmPassword: [""],
              },
              { validator: this.checkPasswords }
            );
          } else {
            this.router.navigate(["/auth/login"]);
          }
        });
    }
  }

  async onClickForgotPassword() {
    try {
      const { value: email, isDenied } = await Swal.fire({
        title: "Input email address",
        input: "email",
        inputLabel: "Your email address",
        inputPlaceholder: "Enter your email address",
        showDenyButton: true,
        denyButtonText: "cancelar",
        confirmButtonText: "recuperar",
      });
      if (!isDenied && email) {
        const isSended = await this.userService.forgotPassword(email);
        if (isSended.isSended) {
          Swal.fire("Email enviado", isSended.message, "success");
        } else {
          Swal.fire("Algo pasó", isSended.message, "success");
        }
      }
    } catch (error) {}
  }

  checkPasswords(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;
    const confirmPassword = formGroup.get("confirmPassword")?.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  loginUser() {
    const user: LoginI = {
      email: this.loginForm.get("email")?.value,
      password: this.loginForm.get("password")?.value,
    };
    this._userService
      .login(user)
      .pipe(
        catchError((error) => {
          Swal.fire({
            titleText: "ERROR LOGIN",
            text: "Something is wrong",
            icon: "error",
            confirmButtonText: "Try again",
            confirmButtonColor: "#d55",
            confirmButtonAriaLabel: "ssss",
            toast: false,
            showCloseButton: false,
            customClass: {
              confirmButton: `
          outline: none;
          nav-index:none;
          border:none
          `,
            },
          });
          console.log(error);
          this.router.navigate(["/auth/login"]);
          return of();
        })
      )

      .subscribe((data) => {
        console.log(data);
        this.toastr.success(
          `${data.dataUser.name.toUpperCase()} Welcome to ARCHITETCS!`,
          "User Logged"
        );
        this.router.navigate(['profile'])
      });
  }

  changePassword() {
    const payload = {
      token: this.token,
      password: this.loginForm.get("password")?.value as string,
      confirmPassword: this.loginForm.get("confirmPassword")?.value as string,
    };

    this.userService
      .changePassword(payload)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError(() => {
          this.toastr.error(
            "Hubo un error, por favor intenta de nuevo",
            "UPDATE FAILED"
          );
          this.router.navigate(["/auth/login"]);
          return of();
        })
      )
      .subscribe(() => {
        this.toastr.success(
          "Se ha actualizado tu contraseña",
          "UPDATE SUCCESS"
        );
        this.isRecoveryPassword = false;
        this.loginForm.reset();
      });
  }
}
