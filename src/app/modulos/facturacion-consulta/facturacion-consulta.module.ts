import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { FacturacionConsultaComponent } from 'src/app/componentes/facturacion-consulta/facturacion-consulta.component';
import { FacturacionConsultaRoutingModule } from './facturacion-consulta-routing.module';
import { VentaComprobanteService } from 'src/app/servicios/venta-comprobante.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { PuntoVentaService } from 'src/app/servicios/punto-venta.service';



@NgModule({
  declarations: [
    FacturacionConsultaComponent
  ],
  imports: [
    CommonModule,
    FacturacionConsultaRoutingModule,
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
    MatDialogModule,
    MatDividerModule,
    TextMaskModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    TipoComprobanteService,
    ClienteService,
    VentaComprobanteService,
    SucursalService,
    PuntoVentaService
  ],
  entryComponents: [
  ]
})
export class FacturacionConsultaModule { }
