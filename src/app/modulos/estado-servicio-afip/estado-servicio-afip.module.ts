import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadoServicioAfipRoutingModule } from './estado-servicio-afip-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstadoServicioAfipComponent } from 'src/app/componentes/estado-servicio-afip/estado-servicio-afip.component';

@NgModule({
  declarations: [
    EstadoServicioAfipComponent,
  ],
  imports: [
    CommonModule,
    EstadoServicioAfipRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule
  ]
})
export class EstadoServicioAfipModule { }
