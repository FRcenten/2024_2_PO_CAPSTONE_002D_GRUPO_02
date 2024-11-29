import { Component, OnInit } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-lector-qr',
  templateUrl: './lector-qr.component.html',
  styleUrls: ['./lector-qr.component.scss'],
})
export class LectorQrComponent implements OnInit {
  scannedResult: string = ''; // Resultado completo del QR escaneado
  extractedRun: string = ''; // RUN extraído del texto
  isScanning: boolean = false; // Estado del escaneo
  html5QrCode: Html5Qrcode | null = null; // Instancia del lector QR

  constructor(
    private firestore: AngularFirestore, // Instancia de Firestore
    private toastController: ToastController // Controlador para mostrar notificaciones
  ) {}

  ngOnInit() {
    // Comprobar cámaras al iniciar el componente
    this.checkCameras();
  }

  // Comprobar cámaras disponibles y mostrar en consola
  async checkCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');

      if (videoDevices.length === 0) {
        console.error('No hay cámaras disponibles.');
      } else {
        console.log('Cámaras disponibles:', videoDevices);
      }
    } catch (error) {
      console.error('Error al obtener las cámaras:', error);
    }
  }

  // Obtener ID de la cámara preferida (priorizando la integrada o frontal)
  async getPreferredCamera(): Promise<string | null> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');

      if (videoDevices.length === 0) {
        console.error('No hay cámaras disponibles.');
        return null;
      }

      // Priorizar cámaras integradas o frontales
      const preferredCamera = videoDevices.find((device) => /front|integrated/i.test(device.label));
      return preferredCamera ? preferredCamera.deviceId : videoDevices[0].deviceId;
    } catch (error) {
      console.error('Error al obtener las cámaras:', error);
      return null;
    }
  }

  // Iniciar el escaneo con configuraciones ajustadas para códigos QR
  async startWebScan() {
    const cameraId = await this.getPreferredCamera();
    if (!cameraId) {
      console.error('No se encontró ninguna cámara disponible.');
      return;
    }

    // Configuración alternativa para obtener acceso a la cámara si es necesario
    try {
      const constraints = { video: { deviceId: cameraId } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Acceso a la cámara exitoso.');

      this.html5QrCode = new Html5Qrcode("qr-reader");
      this.isScanning = true;

      this.html5QrCode
        .start(
          { deviceId: { exact: cameraId } },
          {
            fps: 15, // Cuadros por segundo
            qrbox: { width: 200, height: 200 }, // Área ajustada
            aspectRatio: 1.0, // Relación de aspecto cuadrada
          },
          (decodedText) => {
            // Cuando se detecta un QR
            this.scannedResult = decodedText;
            console.log('Texto detectado:', decodedText);

            // Extraer el RUN del texto detectado
            this.extractedRun = this.extractRun(decodedText);
            console.log('RUN Extraído:', this.extractedRun);

            // Verificar si el RUN está autorizado en la colección "Registro Visita"
            this.checkAuthorization(this.extractedRun);

            // Detener automáticamente el escaneo después de leer el QR
            this.stopWebScan();
          },
          (errorMessage) => {
            console.warn('Intentando leer el QR...', errorMessage);
          }
        )
        .catch((err) => {
          console.error('Error al iniciar la cámara:', err);
          this.isScanning = false;
        });
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
  }

  // Función para extraer el RUN del texto detectado
  extractRun(text: string): string {
    const runRegex = /RUN=([0-9]{7,8}-[0-9kK])/; // Patrón para encontrar el RUN después de 'RUN='
    const match = text.match(runRegex);
    return match ? match[1] : 'RUN no encontrado';
  }

  // Verificar si el RUN está autorizado en la colección "Registro Visita"
  async checkAuthorization(run: string) {
    try {
      const userRef = this.firestore.collection('Registro Visita', (ref) =>
        ref.where('visitanteRut', '==', run)
      );
      const snapshot = await userRef.get().toPromise();

      if (snapshot && !snapshot.empty) {
        // RUN autorizado
        this.showToast('Permitido', 'success');
      } else {
        // RUN no autorizado
        this.showToast('Denegado', 'danger');
      }
    } catch (error) {
      console.error('Error al consultar Firestore:', error);
      this.showToast('Error al verificar el RUN', 'danger');
    }
  }

  // Mostrar notificación con Toast
  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }

  // Detener el escaneo
  stopWebScan() {
    if (this.html5QrCode) {
      this.html5QrCode.stop().then(() => {
        console.log('Escaneo detenido.');
        this.html5QrCode?.clear();
        this.html5QrCode = null;
        this.isScanning = false;
      });
    }
  }
}
