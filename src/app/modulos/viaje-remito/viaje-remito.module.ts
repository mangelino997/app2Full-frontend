import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViajeRemitoRoutingModule } from './viaje-remito-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViajeRemitoComponent } from 'src/app/componentes/viaje-remito/viaje-remito.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { ViajeRemito } from 'src/app/modelos/viajeRemito';

@NgModule({
  declarations: [
    ViajeRemitoComponent,
  ],
  imports: [
    CommonModule,
    ViajeRemitoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    TextMaskModule
  ],
  providers: [
    ViajeRemitoService,
    ViajeRemito
  ]
})
export class ViajeRemitoModule { }
