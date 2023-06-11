import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ROL } from '@src/app/enums/global.enum';
import { environment } from '@src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { UserI, Usuario } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  public signupForm: FormGroup;
  public isValid = false
  public SITE_KEY = environment.RECAPTCHA_SITE_KEY
  public _ROL = ROL;
  private unsubscribe$: Subject<void> = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _userService: UserService
    ) {
    this.signupForm=this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      rol: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{3}-?[0-9]{6,7}$/)]],
      email: ['',[ Validators.required,
      Validators.email]
    ],
      password: ['',[ 
        Validators.required ,
        Validators.pattern(/^(?=.*\d)(?=.*[!@#$.%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/)
      ]],
      captcha: [null, Validators.required]
    })
  }

  ngOnInit(): void {
  }

  signUp(){
    if(this.signupForm.valid){
      this.isValid=true;
      const USUARIO: UserI ={
        name: this.signupForm.get('name')?.value,
        lastname: this.signupForm.get('lastname')?.value,
        rol: this.signupForm.get('rol')?.value,
        number: this.signupForm.get('number')?.value,
        email: this.signupForm.get('email')?.value,
        password: this.signupForm.get('password')?.value,
      }
      console.log(USUARIO);
        this._userService.signup(USUARIO).subscribe(data => {
        this.toastr.success('Usuario registrado', 'El Usuario se registro con éxito.')
        location.reload()
      }, error =>{
        this.toastr.error(error.message, error.name)
        console.log(error)
        this.router.navigate(['/auth/signup'])
      })
    }else{

    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
