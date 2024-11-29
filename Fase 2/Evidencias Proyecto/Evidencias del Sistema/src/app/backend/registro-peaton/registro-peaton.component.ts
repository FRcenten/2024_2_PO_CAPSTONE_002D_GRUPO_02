import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RVisita } from '../../model';
import { FirestoreService } from '../../servicios/firestore.service';

@Component({
  selector: 'app-registro-peaton',
  templateUrl: './registro-peaton.component.html',
  styleUrls: ['./registro-peaton.component.scss'],
})
export class RegistroPeatonComponent  implements OnInit {
  
  constructor(private firestoreService:FirestoreService) { }

  private path = 'Registro Visita/';
  newRVisita: RVisita ={
      id: this.firestoreService.getId(),
      visitanteRut: '',
      Nombre: '',
      Apellidos: '',
      fechaIngreso: new Date(),
      fechaSalida: new Date() ,
  };
  

  ngOnInit() {}

  GuardarRegistro(){
    this.firestoreService.createDocumento(this.path,this.newRVisita,this.newRVisita.id); 
  }
  
}
