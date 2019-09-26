import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioComponent } from 'src/app/componentes/usuario/usuario.component';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { RolService } from 'src/app/servicios/rol.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { Usuario } from 'src/app/modelos/usuario';

@NgModule({
  declarations: [
    UsuarioComponent,
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    UsuarioService,
    SubopcionPestaniaService,
    RolService,
    SucursalService,
    Usuario
  ]
})
export class UsuarioModule { }
