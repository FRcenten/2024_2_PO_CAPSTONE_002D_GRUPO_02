import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database: AngularFirestore) {}
  
  createDocumento(path: string, data: any, id: string): Promise<void> {
    const collection = this.database.collection(path)
    return collection.doc(id).set(data)
  }
  getDocumento(path: string, id:string){
    const collection = this.database.collection(path)
    return collection.doc(id).valueChanges()
  }
  deleteDocumentos(path: string, id:string){
    const collection = this.database.collection(path)
    return collection.doc(id).delete()
  }
  updateDocumentos(path: string, id:string, data:any){
    const collection = this.database.collection(path)
    return collection.doc(id).update(data)
  }
  getId(){
    return this.database.createId()
  }
  registrarSalida(visitanteRut: string) {
    this.database.collection('registros', ref => ref
      .where('visitanteRut', '==', visitanteRut)
      .orderBy('fechaIngreso', 'desc')
      .limit(1))
      .get()
      .subscribe(snapshot => {
        if (snapshot.empty) {
          console.log("No se encontró ningún registro de ingreso para este visitante.");
          return; 
        }
  
        const registro = snapshot.docs[0].data(); // Obtiene los datos del registro
        const registroId = snapshot.docs[0].id; // Obtiene el ID del registro

        // Actualiza la fecha de salida si no existe
        this.database.collection('Registro Visita').doc(registroId).update({
          fechaSalida: new Date() // Fecha y hora actual
        }).then(() => {
          console.log("Salida registrada correctamente.");
        }).catch(error => {
          console.error("Error al registrar la salida: ", error);
        });
      });
  }
  recuperarContraseña(visitanteRut: string, nuevacontraseña: string){
    this.database.collection('registros', ref => ref
      .where('visitanteRut', '==', visitanteRut)
      .limit(1))
      .get()
      .subscribe(snapshot => {
        if (snapshot.empty) {
          console.log("No se encontró ningún registro para este visitante.");
          return; 
        }
  
        const registroId = snapshot.docs[0].id; 
        
        this.database.collection('Usuarios').doc(registroId).update({
          contraseña: nuevacontraseña
        }).then(() => {
          console.log("Cambio de contraseña registrada correctamente.");
        }).catch(error => {
          console.error("Error al cambiar la contraseña ", error);
        });
      });
  }
}
