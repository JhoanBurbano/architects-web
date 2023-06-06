import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ICreateProperty, IProperty } from "../models/properties";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AsesorService {
  public url = `${environment.API_URL}property/`;
  constructor(private http: HttpClient) {}

  getPropertiesById(_id: string): Observable<any> {
    return this.http.get<any>(`${this.url}${_id}`);
  }

  uploadFiles(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}upload-files`, formData);
  }

  createProperty(Property: ICreateProperty): Observable<any> {
    return this.http.post<any>(`${this.url}create-property`, Property);
  }

  deleteProperty(propertyId: string): Observable<any> {
    return this.http.delete(`${this.url}delete-property/${propertyId}`);
  }

  loadCities() {
    return this.http.get<string[]>(`${this.url}cities`)
  }
}
