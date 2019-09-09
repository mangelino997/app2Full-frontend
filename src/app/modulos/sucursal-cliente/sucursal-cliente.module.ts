import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalClienteRoutingModule } from './sucursal-cliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SucursalClienteComponent } from 'src/app/componentes/sucursal-cliente/sucursal-cliente.component';
import { SucursalClienteService } from 'src/app/servicios/sucursal-cliente.service';

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
    MatProgressBarModule
  ],
  providers: [
    SucursalClienteService
  ]
})
export class SucursalClienteModule { }
