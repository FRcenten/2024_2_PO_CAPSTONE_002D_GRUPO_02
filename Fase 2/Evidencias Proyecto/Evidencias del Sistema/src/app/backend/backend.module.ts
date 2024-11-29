import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroPeatonComponent } from './registro-peaton/registro-peaton.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LectorQrComponent } from './lector-qr/lector-qr.component';



@NgModule({
  declarations: [
    RegistroPeatonComponent,
    LectorQrComponent
   
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
    
    
  ]
})
export class BackendModule { }
