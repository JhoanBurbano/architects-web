import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Observable,
  Subject,
  catchError,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { UserI } from 'src/app/models/user';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
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
  @ViewChild('upload') public upload!: ElementRef;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private profileS: ProfileService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.editUserForm = this.fb.group(
      {
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', Validators.required],
        rol: ['', Validators.required],
        number: ['', Validators.required],
        desc: [''],
        password: [
          '',
          Validators.pattern(
            /^(?=.*\d)(?=.*[!@#$.%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/
          ),
        ],
        confirmPassword: [''],
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { notSame: true };
  }

  ngOnInit(): void {
    this.profileS
      .getData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datos = data.user;
        this.loadForm();
      });
  }

  onClickUpload() {
    this.upload.nativeElement.click();
  }

  loadForm() {
    this.editUserForm.controls['name'].setValue(this.datos.name);
    this.editUserForm.controls['lastname'].setValue(this.datos.lastname);
    this.editUserForm.controls['email'].setValue(this.datos.email);
    this.editUserForm.controls['rol'].setValue(this.datos.rol);
    this.editUserForm.controls['number'].setValue(this.datos.number);
    this.editUserForm.controls['desc'].setValue(this.datos.description);
  }

  editProfile() {
    this.isEdit = true;
    this.toast.info('ahora estas editando tu perfil', 'Editar Activated');
  }

  async onSelectFile(event: Event) {
    let file = (
      (event.target as HTMLInputElement).files as FileList
    )[0] as File;
    let base: string = (await this.extraerBase64(file)) as string;
    let data = await this.getImageDimensions(base);
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
        'La imagen debe tener una relacion de aspecto proporcional 1:1, recortela o elija otra',
        'DIMENSION NO PERMITIDA'
      );
    }
  }

  onDeleteImage() {
    this.newPhoto = null;
    this.Profile = null;
  }

  extraerBase64 = async ($event: File): Promise<string | null> => {
    try {
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          resolve(null);
        };
      });
    } catch (error) {
      return null;
    }
  };

  onChangePassword(active: boolean) {
    if (active) {
      this.changePassword = true;
    } else {
      this.changePassword = false;
    }
    let password = this.editUserForm.get('password');
    let confirmPassword = this.editUserForm.get('confirmPassword');
    password?.setValue('')
    confirmPassword?.setValue('')
  }

  onCancelEdit() {
    this.isEdit = false;
    this.onChangePassword(false);
  }


  async actualizarPerfil() {
    if (this.editUserForm.valid && this.editUserForm.dirty || !this.editUserForm.valid && this.Profile) {
      let init$: Observable<string> = of(this.datos.profile as string);
      if (this.Profile) {
        let formData = new FormData();
        formData.append('file', this.Profile);
        init$ = this.profileS.postImg(formData);
      }
      init$
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap((data) => {
            const newUser: UserI = {
              img: data,
              name: this.editUserForm.get('name')?.value,
              lastname: this.editUserForm.get('lastname')?.value,
              rol: this.editUserForm.get('rol')?.value,
              number: this.editUserForm.get('number')?.value,
              email: this.editUserForm.get('email')?.value,
              description: this.editUserForm.get('desc')?.value,
            };
            if (this.isChangePassword()) {
              newUser['password'] = this.editUserForm.get('password')?.value;
            }
            return this.profileS.updateProfile(newUser, this.datos.id);
          }),
          catchError((error) => {
            console.error(error);
            this.toast.error(error);
            return of(null);
          })
        )
        .subscribe(() => {
          location.reload();
          this.toast.success('Prefil actualizado', 'DONE');
        });
    }
    else{
      this.isEdit = false;
      this.toast.info('No hubieron cambios en el formulario, ahora no estas editando', 'NINGUNA ACCION REALIZADA')
    }
  }

  isChangePassword() {
    let password = this.editUserForm.get('password')?.value;
    if (password !== '') {
      return true;
    }
    return false;
  }

  getImageDimensions(file: string): Promise<{ w: number; h: number }> {
    return new Promise(function (resolved) {
      var i = new Image();
      i.onload = function () {
        resolved({ w: i.width, h: i.height });
      };
      i.src = file;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
