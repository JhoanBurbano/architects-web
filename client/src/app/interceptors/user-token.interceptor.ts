import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LocalStorageService } from "../services/local-storage.service";
import { Keys } from "../enums/global.enum";

@Injectable()
export class UserTokenInterceptor implements HttpInterceptor {
  constructor(private localStorage: LocalStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let req = request;
    const token = this.localStorage.getKey(Keys.TOKEN);
    if (token) {
      req = request.clone({
        setHeaders: {
          auth: token,
          secret: environment.SECRET_APP_KEY,
        },
      });
    } else {
      req = request.clone({
        setHeaders: {
          secret: environment.SECRET_APP_KEY,
        },
      });
    }

    return next.handle(req);
  }
}
