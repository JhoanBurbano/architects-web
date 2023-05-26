import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { UserI } from 'src/app/models/user';
import { SecurityService } from 'src/app/services/security.service';

@Component({
	selector: 'app-accounts',
	templateUrl: './accounts.component.html',
	styleUrls: [ './accounts.component.scss' ]
})
export class AccountsComponent implements OnInit {
	constructor(private securityS: SecurityService, private cookie: CookieService, private toast: ToastrService) {}
	accountList: UserI[] = [];
	ngOnInit(): void {
		this.obtenerUsuarios();
	}


	public obtenerUsuarios() {
		this.securityS.getUser().subscribe(
			(data) => {
				console.log(data);
				this.accountList = data;
			},
			(error) => {
				console.log(error);
			}
		);
	}

	public eliminarUsuario(email: string){
		
		this.securityS.delUser(email).subscribe(
			data=>{
				this.toast.success(data.message, "DELETED")
			}
			,
			err =>{
				this.toast.success(err.message, err.name)
			}
		)
		this.obtenerUsuarios()
	}
}
