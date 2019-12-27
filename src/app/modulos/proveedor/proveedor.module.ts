import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedorRoutingModule } from './proveedor-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatIconModule, MatDividerModule, MatButtonModule, MatDialogModule, MatTreeModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProveedorComponent } from 'src/app/componentes/proveedor/proveedor.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { Proveedor } from 'src/app/modelos/proveedor';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { BancoService } from 'src/app/servicios/banco.service';
import { ProveedorCuentaContableService } from 'src/app/servicios/proveedor-cuenta-contable.service';
import { SucursalBancoService } from 'src/app/servicios/sucursal-banco.service';
import { ProveedorCuentaBancariaService } from 'src/app/servicios/proveedor-cuenta-bancaria.service';

@NgModule({
  declarations: [
    ProveedorComponent
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
    ProveedorCuentaBancariaService,
    ProveedorCuentaContableService,
    SucursalBancoService,
    ProveedorService,
    LocalidadService,
    BancoService,
    BarrioService,
    Proveedor
  ],
  entryComponents: []
})
export class ProveedorModule { }
