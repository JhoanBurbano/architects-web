import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable, BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import {
  Usuario,
  UsuarioLogin,
  JwtResponseI,
  UserI,
  authentificated,
  LoginI,
} from "../models/user";
import { environment } from "src/environments/environment";

@Injectable()
export class UserService {
  public url = `${environment.API_URL}auth/`;
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  public signup(user: UserI): Observable<JwtResponseI> {
    return this.http
      .post<JwtResponseI>(`${this.url}register`, user)
      .pipe(tap(this.setCookies));
  }

  public login(user: LoginI): Observable<JwtResponseI> {
    return this.http
      .post<JwtResponseI>(`${this.url}login`, user)
      .pipe(tap(this.setCookies));
  }

  public logout(): void {
    this.cookieService.delete("ACCESS_TOKEN");
    this.cookieService.delete("USER");
    this.cookieService.delete("ROL");
  }

  private saveToken(token: string, expiresIn: string): void {
    console.log(expiresIn, parseInt(expiresIn));
    this.cookieService.set(
      "ACCESS_TOKEN",
      token,
      parseInt(expiresIn),
      "/",
      "localhost",
      false,
      "None"
    );
  }

  private setCookies = ({ dataUser: { name, rol, auth } }: JwtResponseI) => {
    this.saveToken(auth.token, auth.expiresIn);
    this.cookieService.set(
      "USER",
      name,
      parseInt(auth.expiresIn),
      "/",
      "localhost",
      false,
      "None"
    );
    this.cookieService.set(
      "ROL",
      rol,
      parseInt(auth.expiresIn),
      "/",
      "localhost",
      false,
      "None"
    );
  };

  public forgotPassword(email: string): Promise<any> {
    return this.http
      .get(`${this.url}forgot-password?email=${email}`)
      .toPromise();
  }

  public verifyToken(token: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}verify-token?token=${token}`);
  }

  public changePassword(changes: {password: string, confirmPassword: string, token: string}): Observable<any> {
    return this.http.patch(`${this.url}change-password`, changes);
  }
}
