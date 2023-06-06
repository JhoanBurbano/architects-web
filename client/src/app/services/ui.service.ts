import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
import { TypeNotify } from '../enums/global.enum';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private snackBar: MatSnackBar) { }

  showNotify(mensaje: string, type = TypeNotify.DEFAULT): MatSnackBarRef<any> {
    return this.snackBar.open(mensaje, 'close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['architects-snackbar', `architects-snackbar-${type}`],
    });
  }
}
