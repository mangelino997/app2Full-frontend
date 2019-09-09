import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentaBancariaRoutingModule } from './cuenta-bancaria-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuentaBancariaComponent } from 'src/app/componentes/cuenta-bancaria/cuenta-bancaria.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';

@NgModule({
  declarations: [
    CuentaBancariaComponent,
  ],
  imports: [
    CommonModule,
    CuentaBancariaRoutingModule,
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
    CuentaBancariaService
  ]
})
export class CuentaBancariaModule { }
