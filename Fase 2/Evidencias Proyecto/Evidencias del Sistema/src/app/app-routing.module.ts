import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TrabajadorComponent } from './vistas/trabajador/trabajador.component';
import { AdminLocalComponent } from './vistas/admin-local/admin-local.component';
import { AdminGeneralComponent } from './vistas/admin-general/admin-general.component';
import { LoginComponent } from './vistas/login/login.component';
import { RegistroPeatonComponent } from './backend/registro-peaton/registro-peaton.component';
import { LectorQrComponent } from './backend/lector-qr/lector-qr.component';

const routes: Routes = [
  { path: 'home', component: LoginComponent},
  { path: ' ',  component: LoginComponent},
  { path: 'trabajador', component: TrabajadorComponent},
  { path: 'local', component: AdminLocalComponent},
  { path: 'general', component: AdminGeneralComponent},
  { path: 'registrar', component: RegistroPeatonComponent},
  { path: 'lector', component: LectorQrComponent},
  { path: '**',  component: LoginComponent},
  
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
