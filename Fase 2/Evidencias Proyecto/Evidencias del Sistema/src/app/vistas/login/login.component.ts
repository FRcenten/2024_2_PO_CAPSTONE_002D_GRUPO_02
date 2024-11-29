import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserService } from '../../servicios/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  rut: string = '';
  password: string = '';
  id: string= '';
  errorRut: string = ''; // Mensaje de error para el RUT
  errorPassword: string = ''; // Mensaje de error para contraseña

  constructor(private firestore: AngularFirestore, private router: Router,private userService: UserService,private alertController: AlertController) {}

  ngOnInit() {}

  // Formatear el RUT y validar que no contenga caracteres peligrosos
  private formatRut(rut: string): string {
    const formattedRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    return formattedRut;
  }

  // Validación para asegurarse de que no haya caracteres de SQL Injection
  private containsSQLInjection(input: string): boolean {
    const forbiddenPatterns = [
      /['"%;()&+,]/, // Comillas, porcentaje, paréntesis, y otros caracteres peligrosos
      /--/,           // Comentarios de SQL
      /;/,            // Punto y coma (para terminar consultas maliciosas)
      /select/i,      // Palabra clave SELECT
      /insert/i,      // Palabra clave INSERT
      /drop/i,        // Palabra clave DROP
      /union/i        // Palabra clave UNION
    ];

    return forbiddenPatterns.some(pattern => pattern.test(input));
  }

  async login() {
    this.errorRut = ''; // Limpiar errores previos
    this.errorPassword = '';

    try {
      const formattedRut = this.formatRut(this.rut);
      const sqlij = this.containsSQLInjection(this.rut);
      
      if (sqlij) {
        console.log(sqlij)
        this.errorRut = 'RUT contiene caracteres no válidos.';
        return;
      }
      if (!formattedRut) {
        this.errorRut = 'El RUT es obligatorio.';
        return;
      }

      if (!this.password) {
        this.errorPassword = 'La contraseña es obligatoria.';
        return;
      }

      // Buscar el usuario en la colección Usuarios
      const snapshot = await this.firestore
        .collection('Usuarios', (ref) => ref.where('RUN', '==', formattedRut))
        .get()
        .toPromise();

      if (snapshot && snapshot.docs.length > 0) {
        const user = snapshot.docs[0].data() as any;

        if (user.contrasena === this.password) {
          console.log('Login exitoso:', user);
          
          // Enviar solo nombre, apellidos e ID al servicio
          this.userService.setUserData({
          nombre: user.Nombre,
          apellidos: user.Apellidos,
          id: user.Id // ID del documento en Firestore
          });

          switch (user.Rol) {
            case 'general':
              this.router.navigate(['general']);
              break;
            case 'trabajador':
              this.router.navigate(['trabajador']);
              break;
            case 'local':
              this.router.navigate(['local']);
              break;
            default:
              console.error('Rol no definido');
          }
        } else {
          this.errorPassword = 'La contraseña es incorrecta.';
        }
      } else {
        this.errorRut = 'El usuario no existe.';
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.errorRut = 'Error al conectar con el sistema. Intente nuevamente.';
    }
  }
  async mostrarAlerta() {
    const alert = await this.alertController.create({
      header: 'Información',
      message: 'Para poder cambiar la contraseña, debe contactar a su empleador.',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
  async ayuda() {
    const alert = await this.alertController.create({
      header: 'Información',
      message: 'Si necesita ayuda contactenos al correo contacto@CoFraPa.cl para poder acceder a nuestros servicios.',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
}
