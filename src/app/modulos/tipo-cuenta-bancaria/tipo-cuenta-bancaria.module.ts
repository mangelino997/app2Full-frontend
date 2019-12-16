import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoCuentaBancariaRoutingModule } from './tipo-cuenta-bancaria-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatIconModule, MatButtonModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoCuentaBancariaComponent } from 'src/app/componentes/tipo-cuenta-bancaria/tipo-cuenta-bancaria.component';
import { TipoCuentaBancariaService } from 'src/app/servicios/tipo-cuenta-bancaria.service';
import { TipoCuentaBancaria } from 'src/app/modelos/tipo-cuenta-bancaria';

@NgModule({
  declarations: [
    TipoCuentaBancariaComponent,
  ],
  imports: [
    CommonModule,
    TipoCuentaBancariaRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    TipoCuentaBancariaService,
    TipoCuentaBancaria
  ]
})
export class TipoCuentaBancariaModule { }
