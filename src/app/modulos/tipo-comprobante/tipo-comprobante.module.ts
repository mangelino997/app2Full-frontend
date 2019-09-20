import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoComprobanteRoutingModule } from './tipo-comprobante-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoComprobanteComponent } from 'src/app/componentes/tipo-comprobante/tipo-comprobante.component';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    TipoComprobanteComponent,
  ],
  imports: [
    CommonModule,
    TipoComprobanteRoutingModule,
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
    MatIconModule
  ],
  providers: [
    TipoComprobanteService,
    SubopcionPestaniaService
  ]
})
export class TipoComprobanteModule { }
