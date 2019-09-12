import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoTarifaRoutingModule } from './tipo-tarifa-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoTarifaComponent } from 'src/app/componentes/tipo-tarifa/tipo-tarifa.component';
import { TipoTarifaService } from 'src/app/servicios/tipo-tarifa.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    TipoTarifaComponent,
  ],
  imports: [
    CommonModule,
    TipoTarifaRoutingModule,
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
    SubopcionPestaniaService,
    TipoTarifaService
  ]
})
export class TipoTarifaModule { }