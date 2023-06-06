import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IUploadImageResponse } from "@src/app/models/http-responses.interface";
import { ToastrService } from "ngx-toastr";
import {
  Observable,
  Subject,
  of,
  catchError,
  switchMap,
  takeUntil,
} from "rxjs";
import { ImageDimensions, UserI } from "src/app/models/user";
import { ProfileService } from "src/app/services/profile.service";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit, OnDestroy {
  public editUserForm: FormGroup;
  public classImg: any;
  public urlImg: string | any = null;
  public Profile: File | null = null;
  public datos: any;
  public isEdit: boolean = false;
  public newPhoto: any = null;
  public changePassword = false;
  @ViewChild("upload") public upload!: ElementRef;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private profileS: ProfileService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.editUserForm = this.fb.group(
      {
        name: ["", Validators.required],
        lastname: ["", Validators.required],
        email: ["", Validators.required],
        rol: ["", Validators.required],
        number: ["", Validators.required],
        desc: [""],
        password: [
          "",
          Validators.pattern(
            /^(?=.*\d)(?=.*[!@#$.%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/
          ),
        ],
        confirmPassword: [""],
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;
    const confirmPassword = formGroup.get("confirmPassword")?.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.profileS
      .getData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datos = data;
        this.loadForm();
      });
  }

  onClickUpload(): void {
    this.upload.nativeElement.click();
  }

  loadForm(): void {
    this.editUserForm.patchValue({
      name: this.datos.name,
      lastname: this.datos.lastname,
      email: this.datos.email,
      rol: this.datos.rol,
      number: this.datos.number,
      desc: this.datos.description,
    });
  }

  editProfile(): void {
    this.isEdit = true;
    this.toast.info("ahora estas editando tu perfil", "Editar Activated");
  }

  onSelectFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] as File;
    this.extraerBase64(file).then((base) => {
      this.getImageDimensions(base as string).then((data) => {
        const squareAspectRatio = 1; // Relación de aspecto cuadrada (1:1)
        const mobileAspectRatio = 0.86; // Relación de aspecto vertical (mobile)

        if (
          data.w / data.h === squareAspectRatio ||
          data.w / data.h === mobileAspectRatio
        ) {
          this.newPhoto = base;
          this.Profile = file;
        } else {
          this.toast.show(
            "La imagen debe tener una relación de aspecto proporcional 1:1, recórtela o elija otra",
            "DIMENSION NO PERMITIDA"
          );
        }
      });
    });
  }

  onDeleteImage(): void {
    this.newPhoto = null;
    this.Profile = null;
  }

  actualizarPerfil(): void {
    if (
      (this.editUserForm.valid && this.editUserForm.dirty) ||
      (!this.editUserForm.valid && this.Profile) ||
      this.Profile
    ) {
      let init$: Observable<IUploadImageResponse> = of({
        url: this.datos.profile,
      });

      if (this.Profile) {
        const formData = new FormData();
        formData.append("file", this.Profile);
        init$ = this.profileS.postImg(formData);
      }

      init$
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap(({ url }) => {
            const newUser: UserI = {
              profile: url,
              name: this.editUserForm.get("name")?.value,
              lastname: this.editUserForm.get("lastname")?.value,
              rol: this.editUserForm.get("rol")?.value,
              number: this.editUserForm.get("number")?.value,
              email: this.editUserForm.get("email")?.value,
              description: this.editUserForm.get("desc")?.value,
            };

            if (this.isChangePassword()) {
              newUser["password"] = this.editUserForm.get("password")?.value;
            }

            return this.profileS.updateProfile(newUser, this.datos._id);
          }),
          catchError((error) => {
            console.error(error);
            this.toast.error(error);
            return of(null);
          })
        )
        .subscribe(() => {
          location.reload();
          this.toast.success("Perfil actualizado", "DONE");
        });
    } else {
      this.isEdit = false;
      this.toast.info(
        "No hubo cambios en el formulario, ahora no estás editando",
        "NINGUNA ACCIÓN REALIZADA"
      );
    }
  }

  isChangePassword(): boolean {
    const password = this.editUserForm.get("password")?.value;
    return password !== "";
  }

  extraerBase64(file: File): Promise<string | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        resolve(null);
      };
    });
  }

  onChangePassword(active: boolean): void {
    this.changePassword = active;
    this.editUserForm.get("password")?.setValue("");
    this.editUserForm.get("confirmPassword")?.setValue("");
  }

  getImageDimensions(file: string): Promise<ImageDimensions> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        resolve({ w: image.width, h: image.height });
      };
      image.src = file;
    });
  }

  onCancelEdit(): void {
    this.isEdit = false;
    this.onChangePassword(false);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
