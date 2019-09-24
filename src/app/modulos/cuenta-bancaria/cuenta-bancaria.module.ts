import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentaBancariaRoutingModule } from './cuenta-bancaria-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuentaBancariaComponent } from 'src/app/componentes/cuenta-bancaria/cuenta-bancaria.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CuentaBancariaService } from 'src/app/servicios/cuenta-bancaria.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { CuentaBancaria } from 'src/app/modelos/cuentaBancaria';
import { BancoService } from 'src/app/servicios/banco.service';
import { SucursalBancoService } from 'src/app/servicios/sucursal-banco.service';
import { TipoCuentaBancariaService } from 'src/app/servicios/tipo-cuenta-bancaria.service';
import { MonedaService } from 'src/app/servicios/moneda.service';

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
    TextMaskModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    SubopcionPestaniaService,
    CuentaBancariaService,
    CuentaBancaria,
    BancoService,
    SucursalBancoService,
    TipoCuentaBancariaService,
    MonedaService
  ]
})
export class CuentaBancariaModule { }
