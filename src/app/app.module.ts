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
import { BarrioModule } from './modulos/barrio/barrio.module';
import { ActualizacionPreciosModule } from './modulos/actualizacion-precios/actualizacion-precios.module';
import { AdelantoLoteModule } from './modulos/adelanto-lote/adelanto-lote.module';
import { AdelantoPersonalModule } from './modulos/adelanto-personal/adelanto-personal.module';
import { AforoModule } from './modulos/aforo/aforo.module';
import { AfipCondicionIvaModule } from './modulos/afip-condicion-iva/afip-condicion-iva.module';
import { AreaModule } from './modulos/area/area.module';
import { BugImagenDialogoModule } from './modulos/bug-imagen-dialogo/bug-imagen-dialogo.module';
import { ChequeraModule } from './modulos/chequera/chequera.module';
import { ClienteModule } from './modulos/cliente/cliente.module';
import { ClienteEventualModule } from './modulos/cliente-eventual/cliente-eventual.module';
import { CompaniaSeguroModule } from './modulos/compania-seguro/compania-seguro.module';
import { CondicionCompraModule } from './modulos/condicion-compra/condicion-compra.module';
import { ContactoCompaniaSeguroModule } from './modulos/contacto-compania-seguro/contacto-compania-seguro.module';
import { ContraseniaModule } from './modulos/contrasenia/contrasenia.module';
import { EmitirNotaCreditoModule } from './modulos/emitir-nota-credito/emitir-nota-credito.module';
import { EmpresaModule } from './modulos/empresa/empresa.module';
import { HomeModule } from './modulos/home/home.module';
import { ObraSocialModule } from './modulos/obra-social/obra-social.module';
import { OrdenVentaModule } from './modulos/orden-venta/orden-venta.module';
import { PlanCuentaModule } from './modulos/plan-cuenta/plan-cuenta.module';
import { PuntoVentaAutorizadoModule } from './modulos/punto-venta-autorizado/punto-venta-autorizado.module';
import { ReporteDialogoModule } from './modulos/reporte-dialogo/reporte-dialogo.module';
import { RolModule } from './modulos/rol/rol.module';
import { RolSubopcionModule } from './modulos/rol-subopcion/rol-subopcion.module';
import { SeguridadSocialModule } from './modulos/seguridad-social/seguridad-social.module';
import { SubmoduloModule } from './modulos/submodulo/submodulo.module';
import { TipoContactoModule } from './modulos/tipo-contacto/tipo-contacto.module';
import { TipoCuentaContableModule } from './modulos/tipo-cuenta-contable/tipo-cuenta-contable.module';
import { TipoFamiliarModule } from './modulos/tipo-familiar/tipo-familiar.module';
import { TipoProveedorModule } from './modulos/tipo-proveedor/tipo-proveedor.module';
import { VendedorModule } from './modulos/vendedor/vendedor.module';
import { ViajeModule } from './modulos/viaje/viaje.module';
import { ZonaModule } from './modulos/zona/zona.module';
import { AgendaTelefonicaModule } from './modulos/agenda-telefonica/agenda-telefonica.module';
import { BancoModule } from './modulos/banco/banco.module';
import { BasicoCategoriaModule } from './modulos/basico-categoria/basico-categoria.module';
import { CaeAnticipadoModule } from './modulos/cae-anticipado/cae-anticipado.module';
import { CategoriaModule } from './modulos/categoria/categoria.module';
import { ChequesRechazadosModule } from './modulos/cheques-rechazados/cheques-rechazados.module';
import { ChoferProveedorModule } from './modulos/chofer-proveedor/chofer-proveedor.module';
import { CobradorModule } from './modulos/cobrador/cobrador.module';
import { CompaniaSeguroPolizaModule } from './modulos/compania-seguro-poliza/compania-seguro-poliza.module';
import { ConceptoAfipModule } from './modulos/concepto-afip/concepto-afip.module';
import { CondicionVentaModule } from './modulos/condicion-venta/condicion-venta.module';
import { ConfiguracionVehiculoModule } from './modulos/configuracion-vehiculo/configuracion-vehiculo.module';
import { ConfirmarDialogoModule } from './modulos/confirmar-dialogo/confirmar-dialogo.module';
import { ContactoBancoModule } from './modulos/contacto-banco/contacto-banco.module';
import { ContactoClienteModule } from './modulos/contacto-cliente/contacto-cliente.module';
import { CostosInsumosProductoModule } from './modulos/costos-insumos-producto/costos-insumos-producto.module';
import { CuentaBancariaModule } from './modulos/cuenta-bancaria/cuenta-bancaria.module';
import { CuentaBancariaDialogoModule } from './modulos/cuenta-bancaria-dialogo/cuenta-bancaria-dialogo.module';
import { DeduccionGeneralModule } from './modulos/deduccion-general/deduccion-general.module';
import { DeduccionGeneralTopeModule } from './modulos/deduccion-general-tope/deduccion-general-tope.module';
import { DeduccionPersonalModule } from './modulos/deduccion-personal/deduccion-personal.module';
import { DeduccionPersonalTablaModule } from './modulos/deduccion-personal-tabla/deduccion-personal-tabla.module';
import { DepositoInsumoProductoModule } from './modulos/deposito-insumo-producto/deposito-insumo-producto.module';
import { EjercicioModule } from './modulos/ejercicio/ejercicio.module';
import { EmitirFacturaModule } from './modulos/emitir-factura/emitir-factura.module';
import { EmitirNotaDebitoModule } from './modulos/emitir-nota-debito/emitir-nota-debito.module';
import { ErrorPuntoVentaModule } from './modulos/error-punto-venta/error-punto-venta.module';
import { EscalaTarifaModule } from './modulos/escala-tarifa/escala-tarifa.module';
import { EstadoCivilModule } from './modulos/estado-civil/estado-civil.module';
import { EstadoServicioAfipModule } from './modulos/estado-servicio-afip/estado-servicio-afip.module';
import { FacturaDebitoCreditoModule } from './modulos/factura-debito-credito/factura-debito-credito.module';
import { GananciaNetaModule } from './modulos/ganancia-neta/ganancia-neta.module';
import { GrupoCuentaContableModule } from './modulos/grupo-cuenta-contable/grupo-cuenta-contable.module';
import { LocalidadModule } from './modulos/localidad/localidad.module';
import { LoginModule } from './modulos/login/login.module';
import { MarcaProductoModule } from './modulos/marca-producto/marca-producto.module';
import { MarcaVehiculoModule } from './modulos/marca-vehiculo/marca-vehiculo.module';
import { ModuloModule } from './modulos/modulo/modulo.module';
import { MonedaModule } from './modulos/moneda/moneda.module';
import { MonedaCotizacionModule } from './modulos/moneda-cotizacion/moneda-cotizacion.module';
import { MonedaCuentaContableModule } from './modulos/moneda-cuenta-contable/moneda-cuenta-contable.module';
import { OpcionModule } from './modulos/opcion/opcion.module';
import { OrdenRecoleccionModule } from './modulos/orden-recoleccion/orden-recoleccion.module';
import { OrigenDestinoModule } from './modulos/origen-destino/origen-destino.module';
import { PaisModule } from './modulos/pais/pais.module';
import { PdfDialogoModule } from './modulos/pdf-dialogo/pdf-dialogo.module';
import { PersonalModule } from './modulos/personal/personal.module';
import { PersonalFamiliarModule } from './modulos/personal-familiar/personal-familiar.module';
import { PestaniaModule } from './modulos/pestania/pestania.module';
import { PlanCuentaDialogoModule } from './modulos/plan-cuenta-dialogo/plan-cuenta-dialogo.module';
import { ProductoModule } from './modulos/producto/producto.module';
import { ProveedorModule } from './modulos/proveedor/proveedor.module';
import { ProvinciaModule } from './modulos/provincia/provincia.module';
import { PuntoVentaModule } from './modulos/punto-venta/punto-venta.module';
import { RepartoEntranteModule } from './modulos/reparto-entrante/reparto-entrante.module';
import { RepartoSalienteModule } from './modulos/reparto-saliente/reparto-saliente.module';
import { ResumenClienteModule } from './modulos/resumen-cliente/resumen-cliente.module';
import { RolOpcionModule } from './modulos/rol-opcion/rol-opcion.module';
import { RolSubopcionMenuModule } from './modulos/rol-subopcion-menu/rol-subopcion-menu.module';
import { RubroModule } from './modulos/rubro/rubro.module';
import { RubroProductoModule } from './modulos/rubro-producto/rubro-producto.module';
import { SexoModule } from './modulos/sexo/sexo.module';
import { SindicatoModule } from './modulos/sindicato/sindicato.module';
import { SituacionClienteModule } from './modulos/situacion-cliente/situacion-cliente.module';
import { SoporteModule } from './modulos/soporte/soporte.module';
import { SubopcionModule } from './modulos/subopcion/subopcion.module';
import { SubopcionPestaniaModule } from './modulos/subopcion-pestania/subopcion-pestania.module';
import { SucursalModule } from './modulos/sucursal/sucursal.module';
import { SucursalBancoModule } from './modulos/sucursal-banco/sucursal-banco.module';
import { SucursalClienteModule } from './modulos/sucursal-cliente/sucursal-cliente.module';
import { TalonarioReciboCobradorModule } from './modulos/talonario-recibo-cobrador/talonario-recibo-cobrador.module';
import { TalonarioReciboLoteModule } from './modulos/talonario-recibo-lote/talonario-recibo-lote.module';
import { TipoChequeraModule } from './modulos/tipo-chequera/tipo-chequera.module';
import { TipoComprobanteModule } from './modulos/tipo-comprobante/tipo-comprobante.module';
import { TipoCuentaBancariaModule } from './modulos/tipo-cuenta-bancaria/tipo-cuenta-bancaria.module';
import { TipoDocumentoModule } from './modulos/tipo-documento/tipo-documento.module';
import { TipoPercepcionModule } from './modulos/tipo-percepcion/tipo-percepcion.module';
import { TipoRetencionModule } from './modulos/tipo-retencion/tipo-retencion.module';
import { TipoTarifaModule } from './modulos/tipo-tarifa/tipo-tarifa.module';
import { TipoVehiculoModule } from './modulos/tipo-vehiculo/tipo-vehiculo.module';
import { TramoModule } from './modulos/tramo/tramo.module';
import { UnidadMedidaModule } from './modulos/unidad-medida/unidad-medida.module';
import { UsuarioModule } from './modulos/usuario/usuario.module';
import { UsuarioEmpresaModule } from './modulos/usuario-empresa/usuario-empresa.module';
import { UsuarioEmpresasModule } from './modulos/usuario-empresas/usuario-empresas.module';
import { VehiculoModule } from './modulos/vehiculo/vehiculo.module';
import { VehiculoProveedorModule } from './modulos/vehiculo-proveedor/vehiculo-proveedor.module';
import { VencimientosChoferesModule } from './modulos/vencimientos-choferes/vencimientos-choferes.module';
import { VentaConceptoModule } from './modulos/venta-concepto/venta-concepto.module';
import { VentaTipoModule } from './modulos/venta-tipo/venta-tipo.module';
import { ViajeRemitoModule } from './modulos/viaje-remito/viaje-remito.module';
import { ViajeTipoModule } from './modulos/viaje-tipo/viaje-tipo.module';
import { ViajeUnidadNegocioModule } from './modulos/viaje-unidad-negocio/viaje-unidad-negocio.module';
import { MatMenuModule, MatDividerModule, MatIconModule, MatToolbarModule, MatDialogModule, MatSelectModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { ReporteService } from './servicios/reporte.service';
import { HttpModule } from '@angular/http';

import { LoginComponent } from './componentes/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from './servicios/usuario.service';
import { UsuarioEmpresaService } from './servicios/usuario-empresa.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { LoaderService } from './servicios/loader.service';

const stompConfig: StompConfig = {
  url: 'ws://192.168.0.123:8080/jitws/socket',
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
    LoginComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    // ActualizacionPreciosModule,
    // AdelantoLoteModule,
    // AdelantoPersonalModule,
    // AfipCondicionIvaModule,
    // AforoModule,
    // AgendaTelefonicaModule,
    // AreaModule,
    // BancoModule,
    // BarrioModule,
    // BasicoCategoriaModule,
    // BugImagenDialogoModule,
    // CaeAnticipadoModule,
    // CategoriaModule,
    // ChequeraModule,
    // ChequesRechazadosModule,
    // ChoferProveedorModule,
    // ClienteModule,
    // ClienteEventualModule,
    // CobradorModule,
    // CompaniaSeguroModule,
    // CompaniaSeguroPolizaModule,
    // ConceptoAfipModule,
    // CondicionCompraModule,
    // CondicionVentaModule,
    // ConfiguracionVehiculoModule,
    // ConfirmarDialogoModule,
    // ContactoBancoModule,
    // ContactoClienteModule,
    // ContactoCompaniaSeguroModule,
    // ContraseniaModule,
    // CostosInsumosProductoModule,
    // CuentaBancariaModule,
    // CuentaBancariaDialogoModule,
    // DeduccionGeneralModule,
    // DeduccionGeneralTopeModule,
    // DeduccionPersonalModule,
    // DeduccionPersonalTablaModule,
    // DepositoInsumoProductoModule,
    // EjercicioModule,
    // EmitirFacturaModule,
    // EmitirNotaCreditoModule,
    // EmitirNotaDebitoModule,
    // EmpresaModule,
    // ErrorPuntoVentaModule,
    // EscalaTarifaModule,
    // EstadoCivilModule,
    // EstadoServicioAfipModule,
    // FacturaDebitoCreditoModule,
    // GananciaNetaModule,
    // GrupoCuentaContableModule,
    // HomeModule,
    // LocalidadModule,
    // LoginModule,
    // MarcaProductoModule,
    // MarcaVehiculoModule,
    // ModuloModule,
    // MonedaModule,
    // MonedaCotizacionModule,
    // MonedaCuentaContableModule,
    // ObraSocialModule,
    // OpcionModule,
    // OrdenRecoleccionModule,
    // OrdenVentaModule,
    // OrigenDestinoModule,
    // PaisModule,
    // PdfDialogoModule,
    // PersonalModule,
    // PersonalFamiliarModule,
    // PestaniaModule,
    // PlanCuentaModule,
    // PlanCuentaDialogoModule,
    // ProductoModule,
    // ProveedorModule,
    // ProvinciaModule,
    // PuntoVentaModule,
    // PuntoVentaAutorizadoModule,
    // RepartoEntranteModule,
    // RepartoSalienteModule,
    // ReporteDialogoModule,
    // ResumenClienteModule,
    // RolModule,
    // RolOpcionModule,
    // RolSubopcionModule,
    // RolSubopcionMenuModule,
    // RubroModule,
    // RubroProductoModule,
    // SeguridadSocialModule,
    // SexoModule,
    // SindicatoModule,
    // SituacionClienteModule,
    // SoporteModule,
    // SubmoduloModule,
    // SubopcionModule,
    // SubopcionPestaniaModule,
    // SucursalModule,
    // SucursalBancoModule,
    // SucursalClienteModule,
    // TalonarioReciboCobradorModule,
    // TalonarioReciboLoteModule,
    // TipoChequeraModule,
    // TipoComprobanteModule,
    // TipoContactoModule,
    // TipoCuentaBancariaModule,
    // TipoCuentaContableModule,
    // TipoDocumentoModule,
    // TipoFamiliarModule,
    // TipoPercepcionModule,
    // TipoProveedorModule,
    // TipoRetencionModule,
    // TipoTarifaModule,
    // TipoVehiculoModule,
    // TramoModule,
    // UnidadMedidaModule,
    // UsuarioModule,
    // UsuarioEmpresaModule,
    // UsuarioEmpresasModule,
    // VehiculoModule,
    // VehiculoProveedorModule,
    // VencimientosChoferesModule,
    // VendedorModule,
    // VentaConceptoModule,
    // VentaTipoModule,
    // ViajeModule,
    // ViajeRemitoModule,
    // ViajeTipoModule,
    // ViajeUnidadNegocioModule,
    // ZonaModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    HttpModule,
    MatDialogModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ],
  exports: [],
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
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    // RolSubopcionDialog,
    // RolOpcionDialog,
    // SubopcionPestaniaDialog,
    // UsuarioEmpresaDialog,
    // UsuarioDialogo,
    // VistaPreviaDialogo,
    // PestaniaDialogo,
    // DadorDestinatarioDialogo,
    // DadorDestTablaDialogo,
    // ObservacionesDialogo,
    // ListaUsuariosDialogo,
    // CambiarMonedaPrincipalDialogo,
    // CambiarCobradorPrincipalDialogo,
    // CambiarOVporDefectoDialogo,
    // ListaPreciosDialogo,
    // ConfirmarDialogo,
    // ViajeDialogo,
    // ClienteEventualComponent,
    // AforoComponent,
    // ObservacionDialogo,
    // TotalCargaDialogo,
    // TotalConceptoDialogo,
    // ChequesRechazadosComponent,
    // AcompanianteDialogo,
    // ErrorPuntoVentaComponent,
    // PersonalFamiliarComponent,
    // PlanCuentaDialogo,
    // VerTarifaDialogo,
    // ListasDePreciosDialog,
    // ConfirmarDialogoComponent,
    // PdfDialogoComponent,
    // BugImagenDialogoComponent,
    // AnularDialogo,
    // NormalizarDialogo,
    // ImporteAnualDialogo,
    // AgregarItemDialogo,
    // DetallePercepcionesDialogo,
    // DetalleVencimientosDialogo,
    // CuentaBancariaDialogoComponent,
    // AdelantoLoteDialogo,
    // PrestamoDialogo,
    // ReporteDialogoComponent,
    // DetalleAdelantoDialogo
  ]
})
export class AppModule { }