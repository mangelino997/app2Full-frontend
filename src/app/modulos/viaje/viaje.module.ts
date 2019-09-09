import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViajeRoutingModule } from './viaje-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatProgressSpinnerModule, MatCardModule, MatStepperModule, MatIconModule, MatCheckboxModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ViajeComponent } from 'src/app/componentes/viaje/viaje.component';
import { ViajeTramoComponent } from 'src/app/componentes/viaje/viaje-tramo/viaje-tramo.component';
import { ViajeCombustibleComponent } from 'src/app/componentes/viaje/viaje-combustible/viaje-combustible.component';
import { ViajeEfectivoComponent } from 'src/app/componentes/viaje/viaje-efectivo/viaje-efectivo.component';
import { ViajeInsumoComponent } from 'src/app/componentes/viaje/viaje-insumo/viaje-insumo.component';
import { ViajeGastoComponent } from 'src/app/componentes/viaje/viaje-gasto/viaje-gasto.component';
import { ViajePeajeComponent } from 'src/app/componentes/viaje/viaje-peaje/viaje-peaje.component';
import { ViajeRemitoGSComponent } from 'src/app/componentes/viaje/viaje-remito-gs/viaje-remito-gs.component';
import { ViajePeajeService } from 'src/app/servicios/viaje-peaje';
import { ViajeGastoService } from 'src/app/servicios/viaje-gasto';
import { ViajeInsumoService } from 'src/app/servicios/viaje-insumo';
import { ViajeEfectivoService } from 'src/app/servicios/viaje-efectivo';
import { ViajeTramoService } from 'src/app/servicios/viajea-tramo.service';
import { ViajeService } from 'src/app/servicios/viaje.service';
import { ViajeCombustibleService } from 'src/app/servicios/viaje-combustible';
import { Viaje } from 'src/app/modelos/viaje';

@NgModule({
  declarations: [
    ViajeComponent,
    ViajeTramoComponent,
    ViajeCombustibleComponent,
    ViajeEfectivoComponent,
    ViajeInsumoComponent,
    ViajeRemitoGSComponent,
    ViajeGastoComponent,
    ViajePeajeComponent
  ],
  imports: [
    CommonModule,
    ViajeRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatStepperModule,
    TextMaskModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  providers: [
    ViajeService,
    ViajePeajeService,
    ViajeGastoService,
    ViajeInsumoService,
    ViajeEfectivoService,
    ViajeTramoService,
    ViajeCombustibleService,
    Viaje
  ]
})
export class ViajeModule { }
