import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GananciaNetaRoutingModule } from './ganancia-neta-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GananciaNetaComponent } from 'src/app/componentes/ganancia-neta/ganancia-neta.component';
import { TextMaskModule } from 'angular2-text-mask';
import { AfipGananciaNetaService } from 'src/app/servicios/afip-ganancia-neta.service';
import { AfipGananciaNeta } from 'src/app/modelos/afipGananciaNeta';
import { MensajeExcepcion } from 'src/app/modelos/mensaje-excepcion';

@NgModule({
  declarations: [
    GananciaNetaComponent,
  ],
  imports: [
    CommonModule,
    GananciaNetaRoutingModule,
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
    AfipGananciaNetaService,
    AfipGananciaNeta,
    MensajeExcepcion
  ]
})
export class GananciaNetaModule { }
