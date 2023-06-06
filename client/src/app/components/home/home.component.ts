import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { IProperty } from '@src/app/models/properties';
import { HomeService } from 'src/app/services/home.service';
import { ProfileService } from 'src/app/services/profile.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
	encabezado = 'Los Mas Buscados';
	rol = this.cookie.get('ROL');
	favoritos: [] | any = [];
	constructor(
		private profileS: ProfileService,
		private homeS: HomeService,
		private toast: ToastrService,
		private cookie: CookieService,
    private router: Router
	) {}
	inmuebles: IProperty[] = [];

	ngOnInit(): void {
		this.obtenerInmuebles();
	}

  noLogin(){
    if(this.rol===''){
      this.router.navigate(['/auth/signup'])
    }
  }
	async obtenerInmuebles() {
    try {
      this.loadFavorites();
      const data = await this.homeS.getInmuebles()
      this.inmuebles = data;
    } catch (error) {
      Swal.fire('Ocurrio un error', undefined, 'error')
    }
    
	}

  async loadFavorites(){
    if(this.rol === 'CLIENT'){
      try {
        this.favoritos = await this.homeS.getFavorites(null)
      } catch (error) {
        
      }
    }
  }

	async addFavorite(idInm: any) {
    if(!this.rol){
      return this.noLogin()
    }
    if(this.rol !== 'CLIENT'){
      this.toast.warning('Los Asesores no pueden dar likes', 'WARNING')
    }

    try {
			const message = await this.homeS.addFavorite(idInm);
      if(message.message === 'Añadido a favoritos'){
			Swal.fire({
				titleText: 'Susess',
				text: message.message,
				icon: message.icon,
			});
    }else{
      const {isConfirmed, isDenied} = await Swal.fire({
        titleText: '¿Estas seguro que quieres remover de tus favoritos?',
        icon: 'question',
        showDenyButton:true,
        showConfirmButton: true,
        confirmButtonText: 'Si',
        denyButtonText: 'No'
      })
      if(isConfirmed){
        const removed = await this.homeS.removeFavorite(idInm);
        Swal.fire({
          titleText: 'Susess',
          text: removed.message,
          icon: removed.icon,
        })
      }
    }
    this.loadFavorites()
    this.obtenerInmuebles()
		} catch (error) {
			Swal.fire('Error del try', 'Ocurrio un error');
		}
	}

  async viewInmueble(idInm:any){
    this.router.navigate([`/inmueble/${idInm}`])
  }
}
