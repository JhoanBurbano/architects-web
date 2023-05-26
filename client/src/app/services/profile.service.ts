import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { UserI } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public url=`${environment.API_URL}profile/`;

  constructor(private http: HttpClient, private cookie:CookieService, private router: Router) {
  }

  getData(psw:boolean= false):Observable<any>{
    return this.http.get(`${this.url}?psw=${psw}`)
  }

  getFavorites(id:any):Observable<any>{
    return this.http.get(`${this.url}favorites?id=${id}`)
  }

  postImg(formData:FormData):Observable<string>{
    return  this.http.post<string>(`${this.url}uploads`, formData)
  }

  updateProfile(formData:UserI, id:string):Observable<any>{
    return this.http.put(`${this.url}update/${id}`, formData).pipe(tap(
      (res:any)=>{
        if(this.cookie.get('USER')!==`${res.name} ${res.lastname}`){
          this.cookie.delete("USER",'/', 'localhost',false,  "None")
          this.cookie.set('USER', `${res.name} ${res.lastname}`, parseInt(res.expiresIn), '/', 'localhost',false,  "None")
        }
      }
    ))
  }
}
