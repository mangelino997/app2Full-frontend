import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViajeRemitoRoutingModule } from './viaje-remito-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViajeRemitoComponent } from 'src/app/componentes/viaje-remito/viaje-remito.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { ViajeRemito } from 'src/app/modelos/viajeRemito';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { TipoComprobanteService } from 'src/app/servicios/tipo-comprobante.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { ClienteEventualComponent } from 'src/app/componentes/cliente-eventual/cliente-eventual.component';
import { AfipCondicionIvaService } from 'src/app/servicios/afip-condicion-iva.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { ClienteEventual } from 'src/app/modelos/clienteEventual';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { CobradorService } from 'src/app/servicios/cobrador.service';
import { ZonaService } from 'src/app/servicios/zona.service';
import { RubroService } from 'src/app/servicios/rubro.service';
import { AforoComponent } from 'src/app/componentes/aforo/aforo.component';
import { VentaConfigService } from 'src/app/servicios/venta-config.service';
import { Aforo } from 'src/app/modelos/aforo';

@NgModule({
  declarations: [
    ViajeRemitoComponent,
    ClienteEventualComponent,
    AforoComponent
  ],
  imports: [
    CommonModule,
    ViajeRemitoRoutingModule,
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
    TextMaskModule
  ],
  providers: [
    ViajeRemitoService,
    ViajeRemito,
    SubopcionPestaniaService,
    SucursalService,
    ClienteService,
    TipoComprobanteService,
    AfipCondicionIvaService,
    TipoDocumentoService,
    BarrioService,
    LocalidadService,
    CobradorService,
    ZonaService,
    RubroService,
    SucursalService,
    ClienteEventual,
    VentaConfigService,
    Aforo
  ],
  entryComponents: [
    ClienteEventualComponent,
    AforoComponent
  ]
})
export class ViajeRemitoModule { }
