import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Observable, tap } from "rxjs";
import { UserI } from "../models/user";
import { environment } from "src/environments/environment";
import { IGetFullProfileResponse, IUploadImageResponse } from "../models/http-responses.interface";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  public url = `${environment.API_URL}profile/`;

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private router: Router
  ) {}

  getData(): Observable<any> {
    return this.http.get<UserI>(`${this.url}`);
  }

  getFullData() {
    const params = new HttpParams().set('include', 'name,lastname,email,rol,profile,number,_id')
    return this.http.get<IGetFullProfileResponse>(`${this.url}full`, {params});
  }

  getFavorites(id: any): Observable<any> {
    return this.http.get(`${this.url}favorites?id=${id}`);
  }

  postImg(formData: FormData): Observable<IUploadImageResponse> {
    return this.http.post<IUploadImageResponse>(`${this.url}upload-profile`, formData);
  }

  updateProfile(formData: UserI, id: string): Observable<any> {
    return this.http.put(`${this.url}${id}`, formData).pipe(
      tap((res: any) => {
        if (this.cookie.get("USER") !== `${res.name} ${res.lastname}`) {
          this.cookie.delete("USER", "/", "localhost", false, "None");
          this.cookie.set(
            "USER",
            `${res.name} ${res.lastname}`,
            parseInt(res.expiresIn),
            "/",
            "localhost",
            false,
            "None"
          );
        }
      })
    );
  }
}
