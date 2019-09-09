import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioEmpresasRoutingModule } from './usuario-empresas-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatCheckboxModule, MatProgressSpinnerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioEmpresasComponent } from 'src/app/componentes/usuario-empresas/usuario-empresas.component';

@NgModule({
  declarations: [
    UsuarioEmpresasComponent,
  ],
  imports: [
    CommonModule,
    UsuarioEmpresasRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ]
})
export class UsuarioEmpresasModule { }
