import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { JwtResponseI, UserI, LoginI } from "../models/user";
import { environment } from "src/environments/environment";
import { LocalStorageService } from "./local-storage.service";

@Injectable()
export class UserService {
  public url = `${environment.API_URL}auth/`;
  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {}

  public signup(user: UserI): Observable<JwtResponseI> {
    return this.http
      .post<JwtResponseI>(`${this.url}register`, user)
      .pipe(tap(this.setKeysStorage));
  }

  public login(user: LoginI): Observable<JwtResponseI> {
    return this.http
      .post<JwtResponseI>(`${this.url}login`, user)
      .pipe(tap(this.setKeysStorage));
  }

  public logout(): void {
    this.localStorage.clearStorage();
  }

  private setKeysStorage = ({ dataUser: { name, rol, auth } }: JwtResponseI) => {
    this.localStorage.addKeysLogin(auth.token, name, rol);
  };

  public forgotPassword(email: string): Observable<any> {
    return this.http.get(`${this.url}forgot-password?email=${email}`);
  }

  public verifyToken(token: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}verify-token?token=${token}`);
  }

  public changePassword(changes: {
    password: string;
    confirmPassword: string;
    token: string;
  }): Observable<any> {
    return this.http.patch(`${this.url}change-password`, changes);
  }
}
