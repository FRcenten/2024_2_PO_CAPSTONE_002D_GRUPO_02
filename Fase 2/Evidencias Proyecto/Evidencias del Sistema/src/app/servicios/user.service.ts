import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userData: any = {}; // Almacenamos los datos del usuario aquí

  constructor() {}

  // Método para establecer los datos del usuario
  setUserData(user: any) {
    this.userData = user;
  }

  // Método para obtener los datos del usuario
  getUserData() {
    return this.userData;
  }

  // Método para cerrar sesión (limpiar los datos del usuario)
  logout() {
    this.userData = {}; // Limpiar los datos del usuario
  }
}
