import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChequeraRoutingModule } from './chequera-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChequeraComponent } from 'src/app/componentes/chequera/chequera.component';
import { ChequeraService } from 'src/app/servicios/chequera.service';
import { Chequera } from 'src/app/modelos/chequera';
import { TipoChequeraService } from 'src/app/servicios/tipo-chequera.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    ChequeraComponent,
  ],
  imports: [
    CommonModule,
    ChequeraRoutingModule,
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
    MatIconModule,
    TextMaskModule,
    MatTooltipModule
  ],
  providers: [
    ChequeraService,
    Chequera,
    TipoChequeraService,
    SubopcionPestaniaService,
    CuentaBancariaService
  ]
})
export class ChequeraModule { }
