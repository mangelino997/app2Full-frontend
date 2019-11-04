import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import { AppComponent } from './app.component';

//BUILD PRODUCCION
//node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod --build-optimizer

//Servicios
import { AppService } from './servicios/app.service';
import { LoginService } from './servicios/login.service';
import { GuardiaService } from './servicios/guardia.service';

//Modulos
import { MatMenuModule, MatDividerModule, MatIconModule, MatToolbarModule, MatDialogModule, 
  MatSelectModule, MatProgressSpinnerModule, MatCardModule, MatTableModule, MatButtonModule, MatPaginatorIntl, MatProgressBarModule, MatTreeModule, MatAutocompleteModule } from '@angular/material';
import { ReporteService } from './servicios/reporte.service';
import { HttpModule } from '@angular/http';

import { LoginComponent } from './componentes/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from './servicios/usuario.service';
import { UsuarioEmpresaService } from './servicios/usuario-empresa.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { LoaderService } from './servicios/loader.service';
import { ReporteDialogoComponent } from './componentes/reporte-dialogo/reporte-dialogo.component';
import { FechaService } from './servicios/fecha.service';
import { getDutchPaginatorIntl } from './dutch-paginator-intl';
import { PdfDialogoComponent } from './componentes/pdf-dialogo/pdf-dialogo.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PlanCuentaDialogo } from './componentes/plan-cuenta-dialogo/plan-cuenta-dialogo.component';
import { ConfirmarDialogoComponent } from './componentes/confirmar-dialogo/confirmar-dialogo.component';
import { PlanillaCerradaComponent, ReabrirRepartoDialogo } from './componentes/planilla-cerrada/planilla-cerrada.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ViajeCombustible } from './modelos/viajeCombustible';
import { ViajeEfectivo } from './modelos/viajeEfectivo';
import { Viaje } from './modelos/viaje';
import { ViajeCombustibleService } from './servicios/viaje-combustible';
import { ViajeEfectivoService } from './servicios/viaje-efectivo';
import { InsumoProductoService } from './servicios/insumo-producto.service';
import { ProveedorService } from './servicios/proveedor.service';
import { EmpresaService } from './servicios/empresa.service';
import { ObservacionesDialogo } from './componentes/observaciones-dialogo/observaciones-dialogo.component';
import { AnularDialogo } from './componentes/viaje/anular-dialogo.component';
import { SeguimientoVentaComprobante } from './modelos/seguimientoVentaComprobante';
import { SeguimientoViajeRemito } from './modelos/seguimientoViajeRemito';
import { SeguimientoOrdenRecoleccion } from './modelos/seguimientoOrdenRecoleccion';
import { CombustibleDialogo } from './componentes/combustible-dialogo/combustible-dialogo.component';
import { EfectivoDialogo } from './componentes/efectivo-dialogo/efectivo-dialogo.component';
import { RepartoComprobanteComponent } from './componentes/reparto-comprobante/reparto-comprobante.component';
import { SeguimientoEstadoService } from './servicios/seguimiento-estado.service';
import { RepartoComprobante } from './modelos/repartoComprobante';
import { RepartoComprobanteService } from './servicios/reparto-comprobante.service';
import { TipoComprobanteService } from './servicios/tipo-comprobante.service';
import { OrdenRecoleccionService } from './servicios/orden-recoleccion.service';
import { ViajeRemitoService } from './servicios/viaje-remito.service';
import { VentaComprobanteService } from './servicios/venta-comprobante.service';
import { SeguimientoEstadoSituacionService } from './servicios/seguimiento-estado-situacion.service';
import { SeguimientoVentaComprobanteService } from './servicios/seguimiento-venta-comprobante.service';
import { SeguimientoViajeRemitoService } from './servicios/seguimiento-viaje-remito.service';
import { SeguimientoOrdenRecoleccionService } from './servicios/seguimiento-orden-recoleccion.service';
import { ClienteEventualComponent } from './componentes/cliente-eventual/cliente-eventual.component';
import { AfipCondicionIvaService } from './servicios/afip-condicion-iva.service';
import { TipoDocumentoService } from './servicios/tipo-documento.service';
import { BarrioService } from './servicios/barrio.service';
import { LocalidadService } from './servicios/localidad.service';
import { CobradorService } from './servicios/cobrador.service';
import { ZonaService } from './servicios/zona.service';
import { RubroService } from './servicios/rubro.service';
import { SucursalService } from './servicios/sucursal.service';
import { ClienteService } from './servicios/cliente.service';
import { ClienteEventual } from './modelos/clienteEventual';
import { FceMiPymesDialogoComponent } from './componentes/fce-mi-pymes-dialogo/fce-mi-pymes-dialogo.component';
import { ClienteCuentaBancariaService } from './servicios/cliente-cuenta-bancaria.service';
import { ClienteVtoPagoService } from './servicios/cliente-vto-pago.service';
import { AforoComponent } from 'src/app/componentes/aforo/aforo.component';
import { ListaRemitosDialogoComponent } from './componentes/emitir-factura/lista-remitos-dialogo/lista-remitos-dialogo.component';

const stompConfig: StompConfig = {
  url: 'ws://localhost:8080/jitws/socket',
  // url: 'ws://gestionws.appspot.com:8080/jitws/socket', //LOCAL
  // url: 'ws://rigarws-draimo.appspot.com:8080/jitws/socket', //RIGAR
  // url: 'ws://utews-draimo.appspot.com:8080/jitws/socket', //UTE
  headers: {},
  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 5000,
  debug: true
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ReporteDialogoComponent,
    PdfDialogoComponent,
    PlanCuentaDialogo,
    ConfirmarDialogoComponent,
    PlanillaCerradaComponent,
    ReabrirRepartoDialogo,
    ObservacionesDialogo,
    AnularDialogo,
    CombustibleDialogo,
    EfectivoDialogo,
    RepartoComprobanteComponent,
    ClienteEventualComponent,
    FceMiPymesDialogoComponent,
    AforoComponent,
    ListaRemitosDialogoComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    HttpModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatTreeModule,
    MatProgressBarModule,
    PdfViewerModule,
    MatAutocompleteModule,
    TextMaskModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ],
  providers: [
    AppService,
    GuardiaService,
    LoginService,
    ReporteService,
    UsuarioService,
    UsuarioEmpresaService,
    ToastrService,
    LoaderService,
    ToastrService,
    FechaService,
    StompService,
    ViajeCombustible,
    ViajeCombustibleService,
    InsumoProductoService,
    ViajeEfectivo,
    ViajeEfectivoService,
    Viaje,
    LoaderService,
    ProveedorService,
    RepartoComprobante,
    RepartoComprobanteService,
    EmpresaService,
    SeguimientoVentaComprobante,
    SeguimientoVentaComprobanteService,
    SeguimientoViajeRemito,
    SeguimientoViajeRemitoService,
    SeguimientoOrdenRecoleccion,
    SeguimientoOrdenRecoleccionService,
    SeguimientoEstadoService,
    SeguimientoEstadoSituacionService,
    TipoComprobanteService,
    OrdenRecoleccionService,
    ViajeRemitoService,
    RepartoComprobanteService,
    VentaComprobanteService,
    AfipCondicionIvaService,
    TipoDocumentoService,
    BarrioService,
    LocalidadService,
    CobradorService,
    ZonaService,
    RubroService,
    SucursalService,
    ClienteService,
    ClienteEventual,
    ClienteCuentaBancariaService,
    ClienteVtoPagoService,
    {
      provide: StompConfig,
      useValue: stompConfig
    },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ReporteDialogoComponent,
    PdfDialogoComponent,
    PlanCuentaDialogo,
    ConfirmarDialogoComponent,
    PlanillaCerradaComponent,
    ReabrirRepartoDialogo,
    ObservacionesDialogo,
    AnularDialogo,
    CombustibleDialogo,
    EfectivoDialogo,
    RepartoComprobanteComponent,
    ClienteEventualComponent,
    FceMiPymesDialogoComponent,
    AforoComponent
  ]
})
export class AppModule { }