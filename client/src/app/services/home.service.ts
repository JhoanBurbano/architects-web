import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProperty } from '../models/properties';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public url=environment.API_URL
  constructor( private http: HttpClient) {}

  getInmueble(idInm:any){
    return this.http.get<IProperty[]>(`${this.url}view/${idInm}`)
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

  getFavorites(id:any){
    return this.http.get(`${this.url}profile/favorites?id=${id}`)
  }

  addComment(idInm:any, comment:any):Promise<any>{
    return this.http.patch(`${this.url}inmuebles/comments`, {idInm, comment}).toPromise()
  }

  getComment(idInm:any):Promise<any>{
    return this.http.get(`${this.url}inmuebles/comments?idInm=${idInm}`).toPromise()
  }
}
