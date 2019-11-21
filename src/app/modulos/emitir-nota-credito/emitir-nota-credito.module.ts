import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitirNotaCreditoRoutingModule } from './emitir-nota-credito-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmitirNotaCreditoComponent } from 'src/app/componentes/emitir-nota-credito/emitir-nota-credito.component';
import { NotaCredito } from 'src/app/modelos/notaCredito';
import { AfipActividadService } from 'src/app/servicios/afip-actividad.service';

@NgModule({
  declarations: [
    EmitirNotaCreditoComponent,
  ],
  imports: [
    CommonModule,
    EmitirNotaCreditoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCheckboxModule
  ],
  providers: [
    NotaCredito,
    AfipActividadService
  ]
})
export class EmitirNotaCreditoModule { }
