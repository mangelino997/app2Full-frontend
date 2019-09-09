import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonedaCotizacionRoutingModule } from './moneda-cotizacion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonedaCotizacionComponent } from 'src/app/componentes/moneda-cotizacion/moneda-cotizacion.component';
import { TextMaskModule } from 'angular2-text-mask';
import { MonedaCotizacionService } from 'src/app/servicios/moneda-cotizacion.service';
import { MonedaCotizacion } from 'src/app/modelos/moneda-cotizacion';

@NgModule({
  declarations: [
    MonedaCotizacionComponent,
  ],
  imports: [
    CommonModule,
    MonedaCotizacionRoutingModule,
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
    MonedaCotizacionService,
    MonedaCotizacion
  ]
})
export class MonedaCotizacionModule { }
