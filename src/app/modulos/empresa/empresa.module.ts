import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmpresaComponent, ListaUsuariosDialogo } from 'src/app/componentes/empresa/empresa.component';
import { TextMaskModule } from 'angular2-text-mask';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { Empresa } from 'src/app/modelos/empresa';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { AfipCondicionIvaService } from 'src/app/servicios/afip-condicion-iva.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@NgModule({
  declarations: [
    EmpresaComponent,
    ListaUsuariosDialogo
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
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
    TextMaskModule,
    MatIconModule
  ],
  providers: [
    EmpresaService,
    Empresa,
    SubopcionPestaniaService,
    BarrioService,
    LocalidadService,
    AfipCondicionIvaService,
    UsuarioService
  ],
  entryComponents: [
    ListaUsuariosDialogo
  ]
})
export class EmpresaModule { }
