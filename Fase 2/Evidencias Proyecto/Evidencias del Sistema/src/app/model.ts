
export interface Usuario {
    id: string;
    rut: string;
    nombre: string;
    apellidos: string;
    rol: string;
    tipoIngreso: string;
    fechaNacimiento: Date;
    telefono: string;
    direccion: string;
    empresaId: string;
  }
  
  export interface Vehiculo {
    id: string;
    patente: string;
    marca: string;
    modelo: string;
    color: string;
    propietarioRut: string;
  }
  
  export interface Asistencia {
    id: string;
    usuarioRut: string;
    fechaEntrada: Date;
    fechaSalida: Date;
    edificioId: string;
    observaciones: string;
  }
  
  export interface Edificio {
    id: string;
    nombre: string;
    direccion: string;
    capacidad: number;
  }
  
  export interface RegistroVisita {
    id: string;
    visitanteRut: string;
    tipoVisita: string;
    fechaIngreso: Date;
    fechaSalida: Date;
    edificioId: string;
  }
  
  export interface RegistroVehiculo {
    id: string;
    vehiculoId: string;
    fechaIngreso: Date;
    fechaSalida: Date;
    edificioId: string;
  }
  
  export interface RegistroAcciones {
    id: string;
    conserjeRut: string;
    accion: string;
    fechaAccion: Date;
    edificioId: string;
  }
  
  export interface Empresa {
    id: string;
    nombre: string;
    direccion: string;
    telefono: string;
    correo: string;
  }
  export interface RVisita {
    id: string;
    visitanteRut: string;
    Nombre: string;
    Apellidos: string;
    fechaIngreso: Date;
    fechaSalida: Date;
  }


  