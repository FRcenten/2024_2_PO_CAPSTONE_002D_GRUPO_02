import { Component, OnInit } from '@angular/core';
import { UserService } from '../../servicios/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-general',
  templateUrl: './admin-general.component.html',
  styleUrls: ['./admin-general.component.scss'],
})
export class AdminGeneralComponent  implements OnInit {

  nombre: string = '';
  apellidos: string = '';
  id: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Obtén los datos del usuario del servicio
    const userData = this.userService.getUserData();
    this.nombre = userData.nombre;
    this.apellidos = userData.apellidos;
    this.id = userData.id;
  }

  // Método para cerrar sesión
  logout() {
    this.userService.logout(); // Limpiar los datos del usuario
    this.router.navigate(['home']); // Redirigir al login
  }
}