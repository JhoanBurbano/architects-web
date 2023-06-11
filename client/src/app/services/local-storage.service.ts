import { Injectable } from '@angular/core';
import { Keys } from '../enums/global.enum';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setValue(key: Keys, value: string, ){
    localStorage.setItem(key, value)
  }

  removeKey(key: Keys){
    localStorage.removeItem(key)
  }

  addKeysLogin(token: string, user: string, rol: string){
    localStorage.setItem(Keys.TOKEN, token);
    localStorage.setItem(Keys.USER, user);
    localStorage.setItem(Keys.ROL, rol);
  }

  updateChangeUser(_name: string){
    let name = localStorage.getItem(Keys.USER)
    if(name !== _name) {
      this.removeKey(Keys.USER)
      this.setValue(Keys.USER, _name)
    }
  }

  clearStorage(){
    localStorage.clear()
  }

  check() {
    let haveAllKeys = Object.values(Keys).map(key => !!localStorage.getItem(key)).every( v => v === true)
    return haveAllKeys
  }

  getKey(key: Keys) {
    return localStorage.getItem(key);
  }
}
