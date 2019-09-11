import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioEmpresasRoutingModule } from './usuario-empresas-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatCheckboxModule, MatProgressSpinnerModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioEmpresasComponent } from 'src/app/componentes/usuario-empresas/usuario-empresas.component';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

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
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  providers: [
    UsuarioEmpresaService,
    UsuarioService
  ]
})
export class UsuarioEmpresasModule { }
