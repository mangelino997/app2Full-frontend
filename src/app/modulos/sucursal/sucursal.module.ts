import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalRoutingModule } from './sucursal-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SucursalComponent } from 'src/app/componentes/sucursal/sucursal.component';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';

@NgModule({
  declarations: [
    SucursalComponent,
  ],
  imports: [
    CommonModule,
    SucursalRoutingModule,
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
    SucursalService,
    SubopcionPestaniaService,
    BarrioService,
    LocalidadService
  ]
})
export class SucursalModule { }
