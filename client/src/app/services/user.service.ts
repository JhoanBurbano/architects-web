import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, BehaviorSubject} from 'rxjs';
import { tap } from 'rxjs/operators';
import { Usuario, UsuarioLogin, JwtResponseI, UserI, authentificated} from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  public url=`${environment.API_URL}auth/`
  authSubject = new BehaviorSubject(false)
  private token: string | null = null;
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  public signup(user: UserI):Observable<JwtResponseI>{
    return this.http.post<JwtResponseI>(`${this.url}signup`, user).pipe(tap(
      (res:JwtResponseI)=>{
        if(res){
          //guardar
        this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn)
        this.cookieService.set('USER', res.dataUser.name, parseInt(res.dataUser.expiresIn), '/', 'localhost',false,  "None")
        this.cookieService.set('ROL', res.dataUser.rol, parseInt(res.dataUser.expiresIn), '/', 'localhost',false,  "None")
        }
      }
    ))
  }

  public login(user: UserI):Observable<JwtResponseI>{
    return this.http.post<JwtResponseI>(`${this.url}login`, user).pipe(tap(
      (res: JwtResponseI)=>{
        //save token
        this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn)
        this.cookieService.set('USER', res.dataUser.name, parseInt(res.dataUser.expiresIn), '/', 'localhost',false,  "None")
        this.cookieService.set('ROL', res.dataUser.rol, parseInt(res.dataUser.expiresIn), '/', 'localhost',false,  "None")
      }
    ))
  }

  public logout():void{
    this.token = '';
    this.cookieService.delete("ACCESS_TOKEN");
    this.cookieService.delete("USER");
    this.cookieService.delete("ROL");
  }

  private saveToken(token: string, expiresIn: string):void{
    console.log(expiresIn)
      this.cookieService.set('ACCESS_TOKEN', token, parseInt(expiresIn), '/', 'localhost',false,  "None");
      this.token = token;
  }

  private getToken(){
    if(!this.token){
      this.token = this.cookieService.get("ACCESS_TOKEN") ;
    }
    return this.token
  }




}
