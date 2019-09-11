import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoChequeraRoutingModule } from './tipo-chequera-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoChequeraComponent } from 'src/app/componentes/tipo-chequera/tipo-chequera.component';
import { TipoChequeraService } from 'src/app/servicios/tipo-chequera.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { TipoChequera } from 'src/app/modelos/tipoChequera';
import { ReporteService } from 'src/app/servicios/reporte.service';

@NgModule({
  declarations: [
    TipoChequeraComponent,
  ],
  imports: [
    CommonModule,
    TipoChequeraRoutingModule,
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
    TipoChequeraService,
    SubopcionPestaniaService,
    TipoChequera,
    ReporteService
  ]
})
export class TipoChequeraModule { }
