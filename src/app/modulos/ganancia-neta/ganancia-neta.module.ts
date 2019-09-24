import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GananciaNetaRoutingModule } from './ganancia-neta-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GananciaNetaComponent } from 'src/app/componentes/ganancia-neta/ganancia-neta.component';
import { TextMaskModule } from 'angular2-text-mask';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AfipGananciaNetaService } from 'src/app/servicios/afip-ganancia-neta.service';
import { AfipGananciaNeta } from 'src/app/modelos/afipGananciaNeta';
import { AfipAlicuotaGananciaService } from 'src/app/servicios/afip-alicuota-ganancia.service';
import { MesService } from 'src/app/servicios/mes.service';
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
    SubopcionPestaniaService,
    AfipGananciaNetaService,
    AfipGananciaNeta,
    AfipAlicuotaGananciaService,
    MesService,
    MensajeExcepcion
  ]
})
export class GananciaNetaModule { }
