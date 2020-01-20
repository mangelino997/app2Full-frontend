import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { CondicionCompraService } from 'src/app/servicios/condicion-compra.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { CompraComprobanteService } from 'src/app/servicios/compra-comprobante.service';
import { FacturacionConsultaComponent } from 'src/app/componentes/facturacion-consulta/facturacion-consulta.component';
import { FacturacionConsultaRoutingModule } from './facturacion-consulta-routing.module';



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
    CondicionCompraService,
    TipoComprobanteService,
    ClienteService,
    CompraComprobanteService,
  ],
  entryComponents: [
  ]
})
export class FacturacionConsultaModule { }
