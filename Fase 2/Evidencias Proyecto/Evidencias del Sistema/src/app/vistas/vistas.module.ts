import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AdminGeneralComponent } from './admin-general/admin-general.component';
import { AdminLocalComponent } from './admin-local/admin-local.component';
import { TrabajadorComponent } from './trabajador/trabajador.component';
import { LoginComponent } from './login/login.component';




@NgModule({
  declarations: [
    AdminGeneralComponent, 
    AdminLocalComponent,
    TrabajadorComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class VistasModule { }
