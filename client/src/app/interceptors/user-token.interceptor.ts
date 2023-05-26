import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserTokenInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let req = request;
    const token:string = this.cookieService.get("ACCESS_TOKEN")
    if(token){
      req=request.clone({
        setHeaders: {
          auth: token,
          secret: environment.SECRET_APP_KEY
        }
      })
    }else{
      req=request.clone({
        setHeaders: {
          secret: environment.SECRET_APP_KEY
        }
      })
    }
    
    return next.handle(req);
  }
}
