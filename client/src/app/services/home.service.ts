import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { inmuebleI } from '../models/inmuebles';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public url=environment.API_URL
  constructor(private cookie: CookieService, private http: HttpClient) { }

  getInmueble(idInm:any):Promise<any>{
    return this.http.get<any>(`${this.url}${idInm}`).toPromise()
  }

  getInmuebles():Promise<any>{
    return this.http.get<any>(`${this.url}`).toPromise()
  }

  addFavorite(idInm:any):Promise<any>{
    return this.http.patch(`${this.url}profile/favorites`, {idInm}).toPromise()
  }

  removeFavorite(idInm:any):Promise<any>{ 
    return this.http.delete(`${this.url}profile/favorites?idInm=${idInm}`).toPromise()
  }

  getFavorites(id:any):Promise<any>{
    return this.http.get(`${this.url}profile/favorites?id=${id}`).toPromise()
  }

  addComment(idInm:any, comment:any):Promise<any>{
    return this.http.patch(`${this.url}inmuebles/comments`, {idInm, comment}).toPromise()
  }

  getComment(idInm:any):Promise<any>{
    return this.http.get(`${this.url}inmuebles/comments?idInm=${idInm}`).toPromise()
  }



  recoveryPass(email:any):Promise<any>{
    return this.http.get(`${this.url}forgot-password?email=${email}`).toPromise() 
  }

  isTokenValid(token:any):Promise<any>{
    return this.http.get(`${this.url}verify-token?token=${token}`).toPromise() 
  }

  changePass(newPass:any):Promise<any>{
    return this.http.patch(`${this.url}change-password`, newPass).toPromise() 
  }
}
