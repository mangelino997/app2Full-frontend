import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoCuentaBancariaRoutingModule } from './tipo-cuenta-bancaria-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoCuentaBancariaComponent } from 'src/app/componentes/tipo-cuenta-bancaria/tipo-cuenta-bancaria.component';
import { TipoCuentaBancariaService } from 'src/app/servicios/tipo-cuenta-bancaria.service';
import { TipoCuentaBancaria } from 'src/app/modelos/tipo-cuenta-bancaria';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

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
    MatIconModule
  ],
  providers: [
    SubopcionPestaniaService,
    TipoCuentaBancariaService,
    TipoCuentaBancaria
  ]
})
export class TipoCuentaBancariaModule { }
