import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanDeactivate,
	CanLoad,
	Route,
	Router,
	RouterStateSnapshot,
	UrlSegment,
	UrlTree
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
	constructor(private cookies: CookieService, private router: Router, private toast: ToastrService) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const token = this.cookies.check('ACCESS_TOKEN');
		const rol = this.cookies.get('ROL');
		if (token && rol) {
			switch (rol) {
				case 'ADMIN':
					return true;
				case 'SECURITY':
					this.toast.error(`you can't authorization`, 'ACCESS DENEGATED');
					this.router.navigate([ '/' ]);
					break;
				case 'ASESOR':
					this.toast.error(`you can't authorization`, 'ACCESS DENEGATED');
					this.router.navigate([ '/' ]);
					break;
				case 'CLIENT':
					this.toast.error(`you can't authorization`, 'ACCESS DENEGATED');
					this.router.navigate([ '/' ]);
					break;

				default:
					this.toast.error('you are not authenticated', 'Error');
					this.router.navigate([ '/auth/', 'login' ]);
					break;
			}
		}
		this.toast.error('you are not authenticated', 'Error');
		this.router.navigate([ '/auth/', 'login' ]);
		return false;
	}
	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return true;
	}
	canDeactivate(
		component: unknown,
		currentRoute: ActivatedRouteSnapshot,
		currentState: RouterStateSnapshot,
		nextState?: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return true;
	}
	canLoad(
		route: Route,
		segments: UrlSegment[]
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return true;
	}
}
