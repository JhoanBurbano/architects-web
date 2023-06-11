import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class SecurityService {
	public url=`${environment.API_URL}security/`;
	constructor(private http: HttpClient) {}

	public getUser(): Observable<any> {
		return this.http.get<any>(`${this.url}accounts`);
	}

	public delUser(email:string): Observable<any>{
		return this.http.delete<any>(`${this.url}delete`, {
			headers: { euser: email}
		})
	}

	
}
