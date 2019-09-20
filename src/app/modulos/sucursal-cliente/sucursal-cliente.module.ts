import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalClienteRoutingModule } from './sucursal-cliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SucursalClienteComponent } from 'src/app/componentes/sucursal-cliente/sucursal-cliente.component';
import { SucursalClienteService } from 'src/app/servicios/sucursal-cliente.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';

@NgModule({
  declarations: [
    SucursalClienteComponent,
  ],
  imports: [
    CommonModule,
    SucursalClienteRoutingModule,
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
    SucursalClienteService,
    SubopcionPestaniaService,
    ClienteService,
    BarrioService,
    LocalidadService
  ]
})
export class SucursalClienteModule { }
