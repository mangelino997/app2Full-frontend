import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteCuentaBancariaService } from 'src/app/servicios/cliente-cuenta-bancaria.service';
import { ClienteVtoPagoService } from 'src/app/servicios/cliente-vto-pago.service';



@NgModule({
  declarations: [
    FceMiPymesModule
  ],
  imports: [
    CommonModule,
    ClienteCuentaBancariaService, 
    ClienteVtoPagoService
  ]
})
export class FceMiPymesModule { }
