import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HomeService } from 'src/app/services/home.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inmueble',
  templateUrl: './inmueble.component.html',
  styleUrls: ['./inmueble.component.scss']
})
export class InmuebleComponent implements OnInit {
  commentForm: FormGroup;
  inmueble: any;
  rol = this.cookie.get('ROL')
  favoritos: [] | any = [];
  idInm: any;
  name = this.cookie.get('USER')
  comments:[] | any = []
  constructor(
    private cookie: CookieService,
    private router: Router,
    private homeS: HomeService,
    private activeR: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ["", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s.,¿?!¡À-ÿ\u00f1\u00d1]{2,250}$/)
      ]]
    })

  }

  ngOnInit(): void {
    this.captureParams()
    this.obtenerInmueble(this.idInm)
  }

  captureParams() {
    this.idInm = this.activeR.snapshot.params['idInm']
  }

  async obtenerComentarios(){
    try {
      this.comments = await this.homeS.getComment(this.idInm)
    } catch (error:any) {
      Swal.fire(error.name, error.message, 'error')
    }
  }

  async obtenerInmueble(idInm: any) {
    try {
      this.loadFavorites();
      const data = await this.homeS.getInmueble(idInm)
      this.inmueble = data;
      this.comments = this.inmueble.comments
    } catch (error) {
      Swal.fire('Ocurrio un error', undefined, 'error')
    }

  }
  noLogin() {
    if (this.rol === '') {
      this.router.navigate(['/auth/signup'])
    }
  }
  async loadFavorites() {
    if (this.rol === 'CLIENT') {
      try {
        this.favoritos = await this.homeS.getFavorites(null)
      } catch (error) {

      }
    }
  }

  async addFavorite(idInm: any) {
    try {
      const message = await this.homeS.addFavorite(idInm);
      if (message.message === 'Añadido a favoritos') {
        Swal.fire({
          titleText: 'Susess',
          text: message.message,
          icon: message.icon,
        });
      } else {
        const { isConfirmed, isDenied } = await Swal.fire({
          titleText: '¿Estas seguro que quieres remover de tus favoritos?',
          icon: 'question',
          showDenyButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Si',
          denyButtonText: 'No'
        })
        if (isConfirmed) {
          const removed = await this.homeS.removeFavorite(idInm);
          Swal.fire({
            titleText: 'Susess',
            text: removed.message,
            icon: removed.icon,
          })
        }
      }
      this.loadFavorites()
      this.obtenerInmueble(idInm)
    } catch (error) {
      Swal.fire('Error del try', 'Ocurrio un error');
    }
  }

  async addComment(event: any) {
    event.preventDefault()
    if (this.commentForm.valid) {

    try {
      const comment = {
        content: this.commentForm.get('content')?.value
      }
     const msg =  await this.homeS.addComment(this.idInm, comment)
     this.commentForm.reset()
     Swal.fire(msg.message, undefined, 'success')
     this.obtenerComentarios()
    } catch (error:any) {
      Swal.fire(error.name, error.message, 'error')
    }
    }
  }

}
