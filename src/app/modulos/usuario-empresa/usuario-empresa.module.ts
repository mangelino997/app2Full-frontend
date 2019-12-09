import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioEmpresaRoutingModule } from './usuario-empresa-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioEmpresaComponent, UsuarioEmpresaDialog } from 'src/app/componentes/usuario-empresa/usuario-empresa.component';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { UsuarioEmpresa } from 'src/app/modelos/usuarioEmpresa';

@NgModule({
  declarations: [
    UsuarioEmpresaComponent,
    UsuarioEmpresaDialog
  ],
  imports: [
    CommonModule,
    UsuarioEmpresaRoutingModule,
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
    UsuarioEmpresaService,
    UsuarioEmpresa,
  ],
  entryComponents: [
    UsuarioEmpresaDialog
  ]
})
export class UsuarioEmpresaModule { }
