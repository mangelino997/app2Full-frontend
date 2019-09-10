import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedorRoutingModule } from './proveedor-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatIconModule, MatDividerModule, MatButtonModule, MatDialogModule, MatTreeModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProveedorComponent } from 'src/app/componentes/proveedor/proveedor.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { Proveedor } from 'src/app/modelos/proveedor';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { RolOpcionService } from 'src/app/servicios/rol-opcion.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { AfipCondicionIvaService } from 'src/app/servicios/afip-condicion-iva.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { TipoProveedorService } from 'src/app/servicios/tipo-proveedor.service';
import { CondicionCompraService } from 'src/app/servicios/condicion-compra.service';
import { BancoService } from 'src/app/servicios/banco.service';
import { TipoCuentaBancariaService } from 'src/app/servicios/tipo-cuenta-bancaria.service';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { PlanCuentaDialogo } from 'src/app/componentes/plan-cuenta-dialogo/plan-cuenta-dialogo.component';

@NgModule({
  declarations: [
    ProveedorComponent,
    PlanCuentaDialogo
  ],
  imports: [
    CommonModule,
    ProveedorRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatTreeModule,
    TextMaskModule
  ],
  providers: [
    ProveedorService,
    Proveedor,
    SubopcionPestaniaService,
    RolOpcionService,
    BarrioService,
    LocalidadService,
    AfipCondicionIvaService,
    TipoDocumentoService,
    TipoProveedorService,
    CondicionCompraService,
    BancoService,
    TipoCuentaBancariaService,
    ProveedorService,
    UsuarioEmpresaService
  ],
  entryComponents: [
    PlanCuentaDialogo
  ]
})
export class ProveedorModule { }
