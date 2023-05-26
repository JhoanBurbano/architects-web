import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserI } from 'src/app/models/user';
import { HomeService } from 'src/app/services/home.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  SITE_KEY: string = '6Le1n0cdAAAAADIbgkv_eIFWhJK0M06pxzOFPiGh'
  token: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _userService: UserService,
    private homeS: HomeService,
    private activeR: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required,
        //  Validators.email
      ],
      password: [
        '',
        Validators.required,
        // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/),
      ],
      captcha: [
        null,
        Validators.required
      ]

    });

    this.token = this.activeR.snapshot.params['token'];
    if(this.token){
      this.captureParams()
    }

  }
  siteKey = "6Le1n0cdAAAAADIbgkv_eIFWhJK0M06pxzOFPiGh"
  ngOnInit(): void {
  }

  async captureParams() {
    try {
      const isValid = await this.homeS.isTokenValid(this.token)
      if (isValid.value) {

        // const { value: password } = await Swal.fire({
        //   title: 'Enter your new password',
        //   input: 'password',
        //   inputLabel: 'Password',
        //   inputPlaceholder: 'Enter your password',
        //   showDenyButton: true,
        //   denyButtonText: "cancelar",
        //   confirmButtonText: "cambiar",
        //   inputAttributes: {
        //     maxlength: '12',
        //     autocapitalize: 'off',
        //     autocorrect: 'off',
        //     pattern: '^(?=.*\d)(?=.*[!@#$.%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$'
        //   }
        // })
        const {value} = await Swal.fire({
          title: 'Login Form',
          html: `<input type="text" id="login" class="swal2-input" placeholder="Password">
          <input type="password" id="password" class="swal2-input" placeholder="Password">`,
          confirmButtonText: 'GUarda',
          focusConfirm: false,
          preConfirm: (): any => {
            const login: any = document.querySelector('#login') 
            const password: any = document.querySelector('#password')
            if (!login || !password) {
              Swal.showValidationMessage(`Please enter login and password`)
            }
            if(login.value === password.value){
              return { login: login.value, password: password.value }
            }else{
              return;
            }
          }
        })
        // const changedPass = await this.homeS.changePass({
        //   newPassword: password,
        //   idUser: isValid.id
        // })

        // Swal.fire(changedPass.message, undefined, 'success')


        // const { value: formValues } = await Swal.fire({
        //   title: 'Multiple inputs',
        //   html:
        //     '<input id="swal-input1" class="swal2-input">' +
        //     '<input id="swal-input2" class="swal2-input">',
        //   focusConfirm: false,
        //   preConfirm: () => {
        //     if(document.getElementById('swal-input1').value !== null){
        //       return [
        //         document.getElementById('swal-input1').value,
        //         document.getElementById('swal-input2').value
        //       ]
        //     }
        //   }
        // })
      }
    } catch (error) {

    }
  }

  async recPass() {

    try {
      const { value: email, isDenied } = await Swal.fire({
        title: 'Input email address',
        input: 'email',
        inputLabel: 'Your email address',
        inputPlaceholder: 'Enter your email address',
        showDenyButton: true,
        denyButtonText: "cancelar",
        confirmButtonText: "recuperar"
      })
      if (!isDenied && email) {
        const isSended = await this.homeS.recoveryPass(email)
        if (isSended.isSended) {
          Swal.fire("Email enviado", isSended.message, 'success')
        } else {
          Swal.fire("Algo pasó", isSended.message, 'success')
        }
      }
    } catch (error) {

    }




  }

  loginUser() {
    const USUARIO: UserI = {
      name: "",
      lastname: "",
      rol: "",
      number: 0,
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    }

    console.log(USUARIO);
    this._userService.login(USUARIO).subscribe(data => {
      console.log(data)
      this.toastr.success(`${data.dataUser.name.toUpperCase()} Welcome to ARCHITETCS!`, "User Logged")
      location.reload()
    }, error => {
      // this.toastr.error('Something is wrong', 'Error Login')
      Swal.fire({
        titleText: 'ERROR LOGIN',
        text: 'Something is wrong',
        icon: 'error',
        confirmButtonText: 'Try again',
        confirmButtonColor: '#d55',
        confirmButtonAriaLabel: 'ssss',
        toast: false,
        // timer: 2000,
        // timerProgressBar: true,
        showCloseButton: false,
        customClass: {
          confirmButton: `
          outline: none;
          nav-index:none;
          border:none
          `
        }
      })
      console.log(error)
      this.router.navigate(['/auth/login'])
    })
  }

}


