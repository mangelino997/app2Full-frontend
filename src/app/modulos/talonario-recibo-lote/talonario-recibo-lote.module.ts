import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalonarioReciboLoteRoutingModule } from './talonario-recibo-lote-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TalonarioReciboLoteComponent } from 'src/app/componentes/talonario-recibo-lote/talonario-recibo-lote.component';
import { TextMaskModule } from 'angular2-text-mask';
import { TalonarioReciboLoteService } from 'src/app/servicios/talonario-recibo-lote.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { TalonarioReciboLote } from 'src/app/modelos/talonarioReciboLote';

@NgModule({
  declarations: [
    TalonarioReciboLoteComponent,
  ],
  imports: [
    CommonModule,
    TalonarioReciboLoteRoutingModule,
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
    TextMaskModule
  ],
  providers: [
    TalonarioReciboLoteService,
    SubopcionPestaniaService,
    TalonarioReciboLote
  ]
})
export class TalonarioReciboLoteModule { }
