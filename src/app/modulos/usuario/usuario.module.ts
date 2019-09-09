import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioComponent } from 'src/app/componentes/usuario/usuario.component';
import { UsuarioService } from 'src/app/servicios/usuario.service';

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
    MatProgressBarModule
  ],
  providers: [
    UsuarioService
  ]
})
export class UsuarioModule { }
