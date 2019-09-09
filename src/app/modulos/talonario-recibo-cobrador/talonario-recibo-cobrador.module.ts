import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalonarioReciboCobradorRoutingModule } from './talonario-recibo-cobrador-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TalonarioReciboCobradorComponent } from 'src/app/componentes/talonario-recibo-cobrador/talonario-recibo-cobrador.component';
import { TextMaskModule } from 'angular2-text-mask';
import { TalonarioReciboService } from 'src/app/servicios/talonario-recibo.service';
import { TalonarioReciboLoteService } from 'src/app/servicios/talonario-recibo-lote.service';

@NgModule({
  declarations: [
    TalonarioReciboCobradorComponent,
  ],
  imports: [
    CommonModule,
    TalonarioReciboCobradorRoutingModule,
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
    TalonarioReciboService,
    TalonarioReciboLoteService
  ]
})
export class TalonarioReciboCobradorModule { }
