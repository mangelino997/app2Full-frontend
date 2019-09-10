import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChoferProveedorRoutingModule } from './chofer-proveedor-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChoferProveedorComponent } from 'src/app/componentes/chofer-proveedor/chofer-proveedor.component';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ChoferProveedor } from 'src/app/modelos/choferProveedor';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';

@NgModule({
  declarations: [
    ChoferProveedorComponent,
  ],
  imports: [
    CommonModule,
    ChoferProveedorRoutingModule,
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
    ChoferProveedorService,
    SubopcionPestaniaService,
    ChoferProveedor,
    ProveedorService,
    BarrioService,
    LocalidadService,
    TipoDocumentoService
  ]
})
export class ChoferProveedorModule { }
