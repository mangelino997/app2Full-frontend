import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContraseniaRoutingModule } from './contrasenia-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContraseniaComponent } from 'src/app/componentes/contrasenia/contrasenia.component';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from 'src/app/modelos/usuario';

@NgModule({
  declarations: [
    ContraseniaComponent,
  ],
  imports: [
    CommonModule,
    ContraseniaRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [
    UsuarioService,
    Usuario
  ]
})
export class ContraseniaModule { }
