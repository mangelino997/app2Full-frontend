import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCheckboxModule, MatMenuModule, MatToolbarModule, MatDividerModule,
  MatSelectModule, MatTabsModule, MatIconModule, MatCardModule, MatSidenavModule,
  MatAutocompleteModule, MatInputModule, MatRadioModule, MatTableModule, MatDialogModule,
  MatProgressBarModule, MatStepperModule, MatTreeModule, MatSortModule, MatProgressSpinnerModule,
  MatTooltipModule, MatListModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import { TextMaskModule } from 'angular2-text-mask';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DatePipe } from '@angular/common';

//BUILD PRODUCCION
//node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod --build-optimizer

//Servicios
import { AppService } from './servicios/app.service';
import { LoginService } from './servicios/login.service';
import { GuardiaService } from './servicios/guardia.service';
import { UsuarioService } from './servicios/usuario.service';
import { PaisService } from './servicios/pais.service';
import { ProvinciaService } from './servicios/provincia.service';
import { LocalidadService } from './servicios/localidad.service';
import { EmpresaService } from './servicios/empresa.service';
import { SubopcionPestaniaService } from './servicios/subopcion-pestania.service';
import { AgendaTelefonicaService } from './servicios/agenda-telefonica.service';
import { AreaService } from './servicios/area.service';
import { BancoService } from './servicios/banco.service';
import { BarrioService } from './servicios/barrio.service';
import { CategoriaService } from './servicios/categoria.service';
import { CobradorService } from './servicios/cobrador.service';
import { CompaniaSeguroService } from './servicios/compania-seguro.service';
import { MarcaProductoService } from './servicios/marca-producto.service';
import { MarcaVehiculoService } from './servicios/marca-vehiculo.service';
import { ModuloService } from './servicios/modulo.service';
import { ObraSocialService } from './servicios/obra-social.service';
import { OrigenDestinoService } from './servicios/origen-destino.service';
import { RolService } from './servicios/rol.service';
import { RubroService } from './servicios/rubro.service';
import { RubroProductoService } from './servicios/rubro-producto.service';
import { SeguridadSocialService } from './servicios/seguridad-social.service';
import { SexoService } from './servicios/sexo.service';
import { SindicatoService } from './servicios/sindicato.service';
import { SituacionClienteService } from './servicios/situacion-cliente.service';
import { SubmoduloService } from './servicios/submodulo.service';
import { SubopcionService } from './servicios/subopcion.service';
import { SucursalService } from './servicios/sucursal.service';
import { SucursalBancoService } from './servicios/sucursal-banco.service';
import { SucursalClienteService } from './servicios/sucursal-cliente.service';
import { TipoComprobanteService } from './servicios/tipo-comprobante.service';
import { TipoContactoService } from './servicios/tipo-contacto.service';
import { TipoCuentaBancariaService } from './servicios/tipo-cuenta-bancaria.service';
import { TipoDocumentoService } from './servicios/tipo-documento.service';
import { TipoProveedorService } from './servicios/tipo-proveedor.service';
import { TipoTarifaService } from './servicios/tipo-tarifa.service';
import { TipoVehiculoService } from './servicios/tipo-vehiculo.service';
import { TramoService } from './servicios/tramo.service';
import { UnidadMedidaService } from './servicios/unidad-medida.service';
import { VendedorService } from './servicios/vendedor.service';
import { ZonaService } from './servicios/zona.service';
import { ClienteService } from './servicios/cliente.service';
import { RolOpcionService } from './servicios/rol-opcion.service';
import { AfipCondicionIvaService } from './servicios/afip-condicion-iva.service';
import { ResumenClienteService } from './servicios/resumen-cliente.service';
import { OrdenVentaService } from './servicios/orden-venta.service';
import { ProveedorService } from './servicios/proveedor.service';
import { CondicionCompraService } from './servicios/condicion-compra.service';
import { PersonalService } from './servicios/personal.service';
import { EstadoCivilService } from './servicios/estado-civil.service';
import { AfipActividadService } from './servicios/afip-actividad.service';
import { AfipComprobanteService } from './servicios/afip-comprobante.service';
import { AfipCondicionService } from './servicios/afip-condicion.service';
import { AfipLocalidadService } from './servicios/afip-localidad.service';
import { AfipModContratacionService } from './servicios/afip-mod-contratacion.service';
import { AfipSiniestradoService } from './servicios/afip-siniestrado.service';
import { AfipSituacionService } from './servicios/afip-situacion.service';
import { EscalaTarifaService } from './servicios/escala-tarifa.service';
import { ChoferProveedorService } from './servicios/chofer-proveedor.service';
import { ConfiguracionVehiculoService } from './servicios/configuracion-vehiculo.service';
import { ContactoBancoService } from './servicios/contacto-banco.service';
import { ContactoClienteService } from './servicios/contacto-cliente.service';
import { ContactoCompaniaSeguroService } from './servicios/contacto-compania-seguro.service';
import { ContactoProveedorService } from './servicios/contacto-proveedor.service';
import { PuntoVentaService } from './servicios/punto-venta.service';
import { OrdenVentaEscalaService } from './servicios/orden-venta-escala.service';
import { FechaService } from './servicios/fecha.service';
import { VehiculoService } from './servicios/vehiculo.service';
import { VehiculoProveedorService } from './servicios/vehiculo-proveedor.service';
import { CompaniaSeguroPolizaService } from './servicios/compania-seguro-poliza.service';
import { CondicionVentaService } from './servicios/condicion-venta.service';
import { RolSubopcionService } from './servicios/rol-subopcion.service';
import { UsuarioEmpresaService } from './servicios/usuario-empresa.service';
import { ViajeRemitoService } from './servicios/viaje-remito.service';
import { InsumoProductoService } from './servicios/insumo-producto.service';
import { ViajePrecioService } from './servicios/viaje-precio.service';
import { ViajeTarifaService } from './servicios/viaje-tarifa.service';
import { ViajeTipoCargaService } from './servicios/viaje-tipo-carga.service';
import { ViajeTipoService } from './servicios/viaje-tipo.service';
import { ViajeTramoClienteService } from './servicios/viaje-tramo-cliente.service';
import { ViajeUnidadNegocioService } from './servicios/viaje-unidad-negocio.service';
import { OpcionService } from './servicios/opcion.service';
import { MonedaService } from './servicios/moneda.service';
import { MonedaCotizacionService } from './servicios/moneda-cotizacion.service';
import { MonedaCuentaContableService } from './servicios/moneda-cuenta-contable.service';
import { PlanCuentaService } from './servicios/plan-cuenta.service';
import { TipoCuentaContableService } from './servicios/tipo-cuenta-contable.service';
import { GrupoCuentaContableService } from './servicios/grupo-cuenta-contable.service';
import { EjercicioService } from './servicios/ejercicio.service';
import { MesService } from './servicios/mes.service';
import { ProductoService } from './servicios/producto.service';
import { AfipConceptoService } from './servicios/afip-concepto.service';
import { OrdenVentaTramoService } from './servicios/orden-venta-tramo.service';
import { VentaTipoItemService } from './servicios/venta-tipo-item.service';
import { OrdenRecoleccionService } from './servicios/orden-recoleccion.service';
import { RepartoTerceroService } from './servicios/reparto-tercero.service';
import { RetiroDepositoService } from './servicios/retiro-deposito.service';
import { RepartoPropioComprobanteService } from './servicios/reparto-propio-comprobante.service';
import { RepartoTerceroComprobanteService } from './servicios/reparto-tercero-comprobante.service';
import { RetiroDepositoComprobanteService } from './servicios/retiro-deposito-comprobante.service';
import { AfipAlicuotaIvaService } from './servicios/afip-alicuota-iva.service';
import { VentaComprobanteService } from './servicios/venta-comprobante.service';
import { VentaComprobanteItemNCService } from './servicios/venta-comprobante-item-nc.service';
import { VentaComprobanteItemNDService } from './servicios/venta-comprobante-item-nd.service';
import { VentaConfigService } from './servicios/venta-config.service';
import { ViajeTerceroTramoService } from './servicios/viaje-tercero-tramo.service';
import { VentaItemConceptoService } from './servicios/venta-item-concepto.service';
import { BasicoCategoriaService } from './servicios/basico-categoria.service';
import { LoaderService } from './servicios/loader.service';
import { TipoFamiliarService } from './servicios/tipo-familiar.service';
import { PersonalFamiliarService } from './servicios/personal-familiar.service';
import { ChequeraService } from './servicios/chequera.service';
import { TipoChequeraService } from './servicios/tipo-chequera.service';
import { CuentaBancariaService } from './servicios/cuenta-bancaria.service';
import { ViajePeajeService } from './servicios/viaje-peaje';
import { ViajeGastoService } from './servicios/viaje-gasto';
import { ViajeInsumoService } from './servicios/viaje-insumo';
import { ViajeEfectivoService } from './servicios/viaje-efectivo';
import { ViajeTramoService } from './servicios/viaje-tramo.service';
import { ClienteOrdenVentaService } from './servicios/cliente-orden-venta.service';
import { ViajeService } from './servicios/viaje.service';
import { OrdenVentaTarifaService } from './servicios/orden-venta-tarifa.service';
import { TalonarioReciboService } from './servicios/talonario-recibo.service';
import { DepositoInsumoProductoService } from './servicios/deposito-insumo-producto.service';
import { SoporteService } from './servicios/soporte.service';
import { ViajeCombustibleService } from './servicios/viaje-combustible';
import { TalonarioReciboLoteService } from './servicios/talonario-recibo-lote.service';
import { FotoService } from './servicios/foto.service';

//Modelos
import { Viaje } from './modelos/viaje';
import { ViajeRemito } from './modelos/viajeRemito';
import { NotaCredito } from './modelos/notaCredito';
import { NotaDebito } from './modelos/notaDebito';
import { Reparto } from './modelos/reparto';
import { UsuarioEmpresa } from './modelos/usuarioEmpresa';
import { CompaniaSeguroPoliza } from './modelos/companiaSeguroPoliza';
import { Vehiculo } from './modelos/vehiculo';
import { Cliente } from './modelos/cliente';
import { Empresa } from './modelos/empresa';
import { Proveedor } from './modelos/proveedor';
import { Moneda } from './modelos/moneda';
import { OrdenVenta } from './modelos/ordenVenta';
import { OrdenVentaEscala } from './modelos/ordenVentaEscala';
import { OrdenVentaTramo } from './modelos/ordenVentaTramo';
import { MonedaCotizacion } from './modelos/moneda-cotizacion';
import { MonedaCuentaContable } from './modelos/moneda-cuenta-contable';
import { TipoCuentaBancaria } from './modelos/tipo-cuenta-bancaria';
import { TipoCuentaContable } from './modelos/tipo-cuenta-contable';
import { GrupoCuentaContable } from './modelos/grupo-cuenta-contable';
import { Ejercicio } from './modelos/ejercicio';
import { CondicionCompra } from './modelos/condicion-compra';
import { CondicionVenta } from './modelos/condicion-venta';
import { Producto } from './modelos/producto';
import { ConceptoAfip } from './modelos/concepto-afip';
import { VentaConcepto } from './modelos/venta-concepto';
import { VentaTipoItem } from './modelos/venta-tipo-item';
import { ViajeUnidadNegocio } from './modelos/viajeUnidadNegocio';
import { ActualizacionPrecios } from './modelos/actualizacionPrecios'
import { OrdenRecoleccion } from './modelos/ordenRecoleccion';
import { RepartoEntrante } from './modelos/repartoEntrante';
import { Aforo } from './modelos/aforo';
import { ClienteEventual } from './modelos/clienteEventual';
import { EmitirFactura } from './modelos/emitirFactura';
import { AfipCondicionIva } from './modelos/afipCondicionIva';
import { BasicoCategoria } from './modelos/basicoCategoria';
import { ChoferProveedor } from './modelos/choferProveedor';
import { Personal } from './modelos/personal';
import { PuntoVenta } from './modelos/puntoVenta';
import { Categoria } from './modelos/categoria';
import { TipoFamiliar } from './modelos/tipo-familiar';
import { PersonalFamiliar } from './modelos/personal-familiar';
import { Usuario } from './modelos/usuario';
import { ViajeTipo } from './modelos/viajeTipo';
import { Chequera } from './modelos/chequera';
import { TipoChequera } from './modelos/tipoChequera';
import { CuentaBancaria } from './modelos/cuentaBancaria';
import { InsumoProducto } from './modelos/insumoProducto';
import { Cobrador } from './modelos/cobrador';
import { configuracionVehiculo } from './modelos/configuracionVehiculo';
import { Foto } from './modelos/foto';
import { Pdf } from './modelos/pdf';
import { ViajeEfectivo } from './modelos/viajeEfectivo';
import { ViajeInsumo } from './modelos/viajeInsumo';
import { ViajeGasto } from './modelos/viajeGasto';
import { ViajePeaje } from './modelos/viajePeaje';
import { ViajeTramo } from './modelos/viajeTramo';
import { ViajeTramoCliente } from './modelos/viajeTramoCliente';
import { ViajeCombustible } from './modelos/viajeCombustible';
import { TalonarioReciboLote } from './modelos/talonarioReciboLote';
import { OrdenVentaTarifa } from './modelos/ordenVentaTarifa';
import { TalonarioReciboCobrador } from './modelos/talonarioReciboCobrador';
import { Soporte } from './modelos/soporte';
import { MensajeExcepcion } from './modelos/mensaje-excepcion';

//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { PaisComponent } from './componentes/pais/pais.component'; //Probado
import { HomeComponent } from './componentes/home/home.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { EmpresaComponent, ListaUsuariosDialogo } from './componentes/empresa/empresa.component';
import { PestaniaComponent } from './componentes/pestania/pestania.component';
import { AgendaTelefonicaComponent } from './componentes/agenda-telefonica/agenda-telefonica.component'; //Probado
import { AreaComponent } from './componentes/area/area.component';
import { BancoComponent } from './componentes/banco/banco.component'; //Probado
import { BarrioComponent } from './componentes/barrio/barrio.component'; //Probado
import { CategoriaComponent } from './componentes/categoria/categoria.component'; //Probado
import { CobradorComponent, CambiarCobradorPrincipalDialogo } from './componentes/cobrador/cobrador.component'; //Probado
import { CompaniaSeguroComponent } from './componentes/compania-seguro/compania-seguro.component'; //Probado
import { MarcaProductoComponent } from './componentes/marca-producto/marca-producto.component'; //Probado
import { MarcaVehiculoComponent } from './componentes/marca-vehiculo/marca-vehiculo.component'; //Probado
import { ModuloComponent } from './componentes/modulo/modulo.component'; //Probado
import { ObraSocialComponent } from './componentes/obra-social/obra-social.component'; //Probado
import { LocalidadComponent } from './componentes/localidad/localidad.component'; //Probado
import { OrigenDestinoComponent } from './componentes/origen-destino/origen-destino.component'; //Probado
import { ProvinciaComponent } from './componentes/provincia/provincia.component'; //Probado
import { RolComponent } from './componentes/rol/rol.component'; //Probado
import { RubroComponent } from './componentes/rubro/rubro.component'; //Probado
import { RubroProductoComponent } from './componentes/rubro-producto/rubro-producto.component'; //Probado
import { SeguridadSocialComponent } from './componentes/seguridad-social/seguridad-social.component'; //Probado
import { SexoComponent } from './componentes/sexo/sexo.component';
import { SindicatoComponent } from './componentes/sindicato/sindicato.component'; //Probado
import { SituacionClienteComponent } from './componentes/situacion-cliente/situacion-cliente.component';
import { SubmoduloComponent } from './componentes/submodulo/submodulo.component'; //Probado
import { SubopcionComponent } from './componentes/subopcion/subopcion.component'; //Probado
import { SucursalComponent } from './componentes/sucursal/sucursal.component'; //Probado
import { SucursalBancoComponent } from './componentes/sucursal-banco/sucursal-banco.component'; //Probado
import { TipoComprobanteComponent } from './componentes/tipo-comprobante/tipo-comprobante.component';
import { TipoContactoComponent } from './componentes/tipo-contacto/tipo-contacto.component';
import { TipoCuentaBancariaComponent } from './componentes/tipo-cuenta-bancaria/tipo-cuenta-bancaria.component';
import { TipoDocumentoComponent } from './componentes/tipo-documento/tipo-documento.component';
import { TipoProveedorComponent } from './componentes/tipo-proveedor/tipo-proveedor.component';
import { TipoTarifaComponent } from './componentes/tipo-tarifa/tipo-tarifa.component';
import { TipoVehiculoComponent } from './componentes/tipo-vehiculo/tipo-vehiculo.component'; //Probado
import { TramoComponent } from './componentes/tramo/tramo.component'; //Probado
import { UnidadMedidaComponent } from './componentes/unidad-medida/unidad-medida.component';
import { VendedorComponent } from './componentes/vendedor/vendedor.component';
import { ZonaComponent } from './componentes/zona/zona.component'; //Probado
import { ClienteComponent, ListasDePreciosDialog, CambiarOVporDefectoDialogo } from './componentes/cliente/cliente.component'; //Probado
import { ResumenClienteComponent } from './componentes/resumen-cliente/resumen-cliente.component';
import { OrdenVentaComponent, VerTarifaDialogo } from './componentes/orden-venta/orden-venta.component';
import { ProveedorComponent } from './componentes/proveedor/proveedor.component'; //Probado
import { CondicionCompraComponent } from './componentes/condicion-compra/condicion-compra.component';
import { PersonalComponent } from './componentes/personal/personal.component'; //Probado
import { EstadoCivilComponent } from './componentes/estado-civil/estado-civil.component';
import { EscalaTarifaComponent } from './componentes/escala-tarifa/escala-tarifa.component'; //Probado
import { ChoferProveedorComponent } from './componentes/chofer-proveedor/chofer-proveedor.component'; //Probado
import { ConfiguracionVehiculoComponent } from './componentes/configuracion-vehiculo/configuracion-vehiculo.component'; //Probado
import { ContactoBancoComponent } from './componentes/contacto-banco/contacto-banco.component'; //Probado
import { ContactoClienteComponent } from './componentes/contacto-cliente/contacto-cliente.component'; //Revisar
import { ContactoCompaniaSeguroComponent } from './componentes/contacto-compania-seguro/contacto-compania-seguro.component'; //Probado
import { ContactoProveedorComponent } from './componentes/contacto-proveedor/contacto-proveedor.component'; //Probado
import { PuntoVentaComponent } from './componentes/punto-venta/punto-venta.component'; //Probado
import { SucursalClienteComponent } from './componentes/sucursal-cliente/sucursal-cliente.component'; //Probado
import { VehiculoComponent } from './componentes/vehiculo/vehiculo.component'; //Probado
import { VehiculoProveedorComponent } from './componentes/vehiculo-proveedor/vehiculo-proveedor.component'; //Probado
import { CompaniaSeguroPolizaComponent } from './componentes/compania-seguro-poliza/compania-seguro-poliza.component';
import { ViajeRemitoComponent } from './componentes/viaje-remito/viaje-remito.component';
import { RolSubopcionComponent, RolSubopcionDialog } from './componentes/rol-subopcion/rol-subopcion.component'; //Probado
import { SubopcionPestaniaComponent, SubopcionPestaniaDialog } from './componentes/subopcion-pestania/subopcion-pestania.component'; //Probado
import { UsuarioEmpresaComponent, UsuarioEmpresaDialog } from './componentes/usuario-empresa/usuario-empresa.component';
import { ViajeComponent } from './componentes/viaje/viaje.component';
import { ActualizacionPreciosComponent, ListaPreciosDialogo, ConfirmarDialogo } from './componentes/actualizacion-precios/actualizacion-precios.component';
import { CaeAnticipadoComponent } from './componentes/cae-anticipado/cae-anticipado.component';
import { EstadoServicioAfipComponent } from './componentes/estado-servicio-afip/estado-servicio-afip.component';
import { EmitirFacturaComponent, ViajeDialogo, ObservacionDialogo, TotalConceptoDialogo, TotalCargaDialogo } from './componentes/emitir-factura/emitir-factura.component';
import { EmitirNotaCreditoComponent } from './componentes/emitir-nota-credito/emitir-nota-credito.component';
import { EmitirNotaDebitoComponent } from './componentes/emitir-nota-debito/emitir-nota-debito.component';
import { MonedaComponent, CambiarMonedaPrincipalDialogo } from './componentes/moneda/moneda.component';
import { MonedaCotizacionComponent } from './componentes/moneda-cotizacion/moneda-cotizacion.component';
import { MonedaCuentaContableComponent } from './componentes/moneda-cuenta-contable/moneda-cuenta-contable.component';
import { PuntosVentaAutorizadoComponent } from './componentes/puntos-venta-autorizado/puntos-venta-autorizado.component';
import { CondicionVentaComponent } from './componentes/condicion-venta/condicion-venta.component';
import { ProductoComponent } from './componentes/producto/producto.component';
import { UsuarioEmpresasComponent } from './componentes/usuario-empresas/usuario-empresas.component';
import { RolSubopcionMenuComponent, UsuarioDialogo, VistaPreviaDialogo, PestaniaDialogo } from './componentes/rol-subopcion-menu/rol-subopcion-menu.component';
import { ConceptoAfipComponent } from './componentes/concepto-afip/concepto-afip.component';
import { RepartoEntranteComponent } from './componentes/reparto-entrante/reparto-entrante.component';
import { VentaConceptoComponent } from './componentes/venta-concepto/venta-concepto.component';
import { ViajeUnidadNegocioComponent } from './componentes/viaje-unidad-negocio/viaje-unidad-negocio.component';
import { OpcionComponent } from './componentes/opcion/opcion.component';
import { ViajeTramoComponent, DadorDestinatarioDialogo, DadorDestTablaDialogo } from './componentes/viaje/viaje-tramo/viaje-tramo.component';
import { ViajeCombustibleComponent } from './componentes/viaje/viaje-combustible/viaje-combustible.component';
import { ViajeEfectivoComponent } from './componentes/viaje/viaje-efectivo/viaje-efectivo.component';
import { ViajeInsumoComponent } from './componentes/viaje/viaje-insumo/viaje-insumo.component';
import { ViajeGastoComponent } from './componentes/viaje/viaje-gasto/viaje-gasto.component';
import { ViajePeajeComponent } from './componentes/viaje/viaje-peaje/viaje-peaje.component';
import { ViajeRemitoGSComponent } from './componentes/viaje/viaje-remito-gs/viaje-remito-gs.component';
import { PlanCuentaComponent } from './componentes/plan-cuenta/plan-cuenta.component';
import { TipoCuentaContableComponent } from './componentes/tipo-cuenta-contable/tipo-cuenta-contable.component';
import { GrupoCuentaContableComponent } from './componentes/grupo-cuenta-contable/grupo-cuenta-contable.component';
import { EjercicioComponent } from './componentes/ejercicio/ejercicio.component';
import { VentaTipoComponent } from './componentes/venta-tipo/venta-tipo.component';
import { OrdenRecoleccionComponent } from './componentes/orden-recoleccion/orden-recoleccion.component';
import { ClienteEventualComponent } from './componentes/cliente-eventual/cliente-eventual.component';
import { AforoComponent } from './componentes/aforo/aforo.component';
import { ChequesRechazadosComponent } from './componentes/cheques-rechazados/cheques-rechazados.component';
import { RepartoComponent, AcompanianteDialogo } from './componentes/reparto-saliente/reparto.component';
import { AfipCondicionIvaComponent } from './componentes/afip-condicion-iva/afip-condicion-iva.component';
import { BasicoCategoriaComponent } from './componentes/basico-categoria/basico-categoria.component';
import { ObservacionesDialogo } from './componentes/viaje/observaciones-dialogo.component';
import { RolOpcionComponent, RolOpcionDialog } from './componentes/rol-opcion/rol-opcion.component';
import { ProgresoComponent } from './componentes/progreso/progreso.component';
import { ErrorPuntoVentaComponent } from './componentes/error-punto-venta/error-punto-venta.component';
import { SoporteComponent } from './componentes/soporte/soporte.component';
import { TipoFamiliarComponent } from './componentes/tipo-familiar/tipo-familiar.component';
import { ContraseniaComponent } from './componentes/contrasenia/contrasenia.component';
import { PersonalFamiliarComponent } from './componentes/personal-familiar/personal-familiar.component';
import { ViajeTipoComponent } from './componentes/viaje-tipo/viaje-tipo.component';
import { CostosInsumosProductoComponent } from './componentes/costos-insumos-producto/costos-insumos-producto.component';
import { VencimientosChoferesComponent } from './componentes/vencimientos-choferes/vencimientos-choferes.component';
import { CuentaBancariaComponent } from './componentes/cuenta-bancaria/cuenta-bancaria.component';
import { TipoChequeraComponent } from './componentes/tipo-chequera/tipo-chequera.component';
import { ChequeraComponent } from './componentes/chequera/chequera.component';
import { DepositoInsumoProductoComponent } from './componentes/deposito-insumo-producto/deposito-insumo-producto.component';
import { DepositoInsumoProducto } from './modelos/depositoInsumoProducto';
import { TalonarioReciboCobradorComponent } from './componentes/talonario-recibo-cobrador/talonario-recibo-cobrador.component';
import { TalonarioReciboLoteComponent } from './componentes/talonario-recibo-lote/talonario-recibo-lote.component';
import { PdfDialogoComponent } from './componentes/pdf-dialogo/pdf-dialogo.component';
import { BugImagenDialogoComponent } from './componentes/bugImagen-dialogo/bug-imagen-dialogo.component';
import { BugImagen } from './modelos/bugImagen';
import { CompraComprobante } from './modelos/compra-comprobante';
import { CompraComprobanteItem } from './modelos/compra-comprobante-item';
import { CompraComprobantePercepcion } from './modelos/compra-comprobante-percepcion';
import { CompraComprobantePercepcionJurisdiccion } from './modelos/compra-comprobante-percepcion-jurisdiccion';
import { OrdenVentaCliente } from './modelos/ordenVentaCliente';
import { OrdenVentaEmpresa } from './modelos/ordenVentaEmpresa';
import { DeduccionGeneralComponent } from './componentes/deduccion-general/deduccion-general.component';
import { AfipDeduccionGeneralService } from './servicios/afip-deduccion-general.service';
import { AfipDeduccionGeneral } from './modelos/afipDeduccionGeneral';
import { DeduccionGeneralTopeComponent } from './componentes/deduccion-general-tope/deduccion-general-tope.component';
import { AfipDeduccionGeneralTopeService } from './servicios/afip-deduccion-general-tope.service';
import { AfipDeduccionGeneralTope } from './modelos/afipDeduccionGeneralTope';
import { DeduccionPersonalComponent } from './componentes/deduccion-personal/deduccion-personal.component';
import { AfipDeduccionPersonalService } from './servicios/afip-deduccion-personal.service';
import { AfipDeduccionPersonal } from './modelos/afipDeduccionPersonal';
import { GananciaNetaComponent } from './componentes/ganancia-neta/ganancia-neta.component';
import { AfipGananciaNetaService } from './servicios/afip-ganancia-neta.service';
import { AfipGananciaNeta } from './modelos/afipGananciaNeta';
import { AfipAlicuotaGananciaService } from './servicios/afip-alicuota-ganancia.service';
import { DeduccionPersonalTablaComponent, ImporteAnualDialogo } from './componentes/deduccion-personal-tabla/deduccion-personal-tabla.component';
import { AfipDeduccionPersonalTabla } from './modelos/afipDeduccionPersonalTabla';
import { AfipTipoBeneficioDeduccionService } from './servicios/afip-tipo-beneficio-deduccion.service';
import { AfipTipoBeneficioService } from './servicios/afip-tipo-beneficio.service';
import { AnularDialogo } from './componentes/viaje/anular-dialogo.component';
import { NormalizarDialogo } from './componentes/viaje/normalizar-dialogo.component';
import { FacturaDebitoCreditoComponent, AgregarItemDialogo, DetallePercepcionesDialogo, DetalleVencimientosDialogo } from './componentes/factura-debito-credito/factura-debito-credito.component';
import { FacturaDebitoCredito } from './modelos/facturaDebitoCredito';
import { CompraComprobanteVencimiento } from './modelos/compra-comprobante-vencimiento';
import { CompraComprobanteService } from './servicios/compra-comprobante.service';
import { ConfirmarDialogoComponent } from './componentes/confirmar-dialogo/confirmar-dialogo.component';
import { TipoPercepcionService } from './servicios/tipo-percepcion.service';
import { PlanCuentaDialogo } from './componentes/plan-cuenta-dialogo/plan-cuenta-dialogo.component';
import { TipoRetencionComponent } from './componentes/tipo-retencion/tipo-retencion.component';
import { TipoRetencion } from './modelos/tipoRetencion';
import { TipoRetencionService } from './servicios/tipo-retencion.service';
import { TipoPercepcionComponent } from './componentes/tipo-percepcion/tipo-percepcion.component';
import { CompraComprobanteVencimientoService } from './servicios/compra-comprobante-vencimiento.service';
import { CuentaBancariaDialogoComponent } from './componentes/cuenta-bancaria-dialogo/cuenta-bancaria-dialogo.component';
import { AdelantoLoteComponent, AdelantoLoteDialogo } from './componentes/adelanto-lote/adelanto-lote.component';
import { TipoPercepcion } from './modelos/tipoPercepcion';
import { PersonalAdelantoService } from './servicios/personal-adelanto.service';
import { PersonalAdelanto } from './modelos/personalAdelanto';
import { AdelantoPersonalComponent, PrestamoDialogo, DetalleAdelantoDialogo } from './componentes/adelanto-personal/adelanto-personal.component';
import { ReporteDialogoComponent } from './componentes/reporte-dialogo/reporte-dialogo.component';

//Rutas
const appRoutes: Routes = [
  // { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [GuardiaService] },
  { path: 'generalespaises', component: PaisComponent, canActivate: [GuardiaService] },
  { path: 'generalesagendatelefonica', component: AgendaTelefonicaComponent, canActivate: [GuardiaService] },
  { path: 'legajosareas', component: AreaComponent, canActivate: [GuardiaService] },
  { path: 'contablebancos', component: BancoComponent, canActivate: [GuardiaService] },
  { path: 'generalesbarrios', component: BarrioComponent, canActivate: [GuardiaService] },
  { path: 'categoriasadministrar', component: CategoriaComponent, canActivate: [GuardiaService] },
  { path: 'generalescobradores', component: CobradorComponent, canActivate: [GuardiaService] },
  { path: 'generalescompaniadeseguro', component: CompaniaSeguroComponent, canActivate: [GuardiaService] },
  { path: 'generaleslocalidades', component: LocalidadComponent, canActivate: [GuardiaService] },
  { path: 'logisticamarcasproductos', component: MarcaProductoComponent, canActivate: [GuardiaService] },
  { path: 'logisticamarcasvehiculos', component: MarcaVehiculoComponent, canActivate: [GuardiaService] },
  { path: 'menumodulos', component: ModuloComponent, canActivate: [GuardiaService] },
  { path: 'obrassocialesadministrar', component: ObraSocialComponent, canActivate: [GuardiaService] },
  { path: 'origenesdestinosadministrar', component: OrigenDestinoComponent, canActivate: [GuardiaService] },
  { path: 'generalesprovincias', component: ProvinciaComponent, canActivate: [GuardiaService] },
  { path: 'rolesadministrar', component: RolComponent, canActivate: [GuardiaService] },
  { path: 'generalesrubros', component: RubroComponent, canActivate: [GuardiaService] },
  { path: 'logisticarubrosproductos', component: RubroProductoComponent, canActivate: [GuardiaService] },
  { path: 'orgprevisionalesadministrar', component: SeguridadSocialComponent, canActivate: [GuardiaService] },
  { path: 'sexo', component: SexoComponent, canActivate: [GuardiaService] },
  { path: 'sindicatosadministrar', component: SindicatoComponent, canActivate: [GuardiaService] },
  { path: 'situacioncliente', component: SituacionClienteComponent, canActivate: [GuardiaService] },
  { path: 'menusubmodulos', component: SubmoduloComponent, canActivate: [GuardiaService] },
  { path: 'menusubopciones', component: SubopcionComponent, canActivate: [GuardiaService] },
  { path: 'organizacionsucursales', component: SucursalComponent, canActivate: [GuardiaService] },
  { path: 'contablebancossucursales', component: SucursalBancoComponent, canActivate: [GuardiaService] },
  { path: 'generalesclientessucursales', component: SucursalClienteComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontiposdecuentabancaria', component: TipoCuentaBancariaComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontiposdecuentascontables', component: TipoCuentaContableComponent, canActivate: [GuardiaService] },
  { path: 'ejerciciosadministrar', component: EjercicioComponent, canActivate: [GuardiaService] },  
  { path: 'logisticatiposdevehiculos', component: TipoVehiculoComponent, canActivate: [GuardiaService] },
  { path: 'origenesdestinostramos', component: TramoComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontiposdemedida', component: UnidadMedidaComponent, canActivate: [GuardiaService] },
  { path: 'usuariosadministrar', component: UsuarioComponent, canActivate: [GuardiaService] },
  { path: 'vendedor', component: VendedorComponent, canActivate: [GuardiaService] },
  { path: 'generaleszonas', component: ZonaComponent, canActivate: [GuardiaService] },
  { path: 'generalesclientes', component: ClienteComponent, canActivate: [GuardiaService] },
  { path: 'listasdepreciosordenesdeventa', component: OrdenVentaComponent, canActivate: [GuardiaService] },
  { path: 'generalesproveedores', component: ProveedorComponent, canActivate: [GuardiaService] },
  { path: 'contablecondicionesdecompra', component: CondicionCompraComponent, canActivate: [GuardiaService] },
  { path: 'contablecondicionesdeventa', component: CondicionVentaComponent, canActivate: [GuardiaService] },
  { path: 'legajosadministraractivos', component: PersonalComponent, canActivate: [GuardiaService] },
  { path: 'listasdepreciosescaladetarifas', component: EscalaTarifaComponent, canActivate: [GuardiaService] },
  { path: 'logisticaproveedoreschoferes', component: ChoferProveedorComponent, canActivate: [GuardiaService] },
  { path: 'logisticavehiculospropiosconfiguracion', component: ConfiguracionVehiculoComponent, canActivate: [GuardiaService] },
  { path: 'contablebancoscontactos', component: ContactoBancoComponent, canActivate: [GuardiaService] },
  { path: 'generalesclientescontactos', component: ContactoClienteComponent, canActivate: [GuardiaService] },
  { path: 'generalescompaniadesegurocontactos', component: ContactoCompaniaSeguroComponent, canActivate: [GuardiaService] },
  { path: 'generalesproveedorescontactos', component: ContactoProveedorComponent, canActivate: [GuardiaService] },
  { path: 'puntosdeventaadministrar', component: PuntoVentaComponent, canActivate: [GuardiaService] },
  { path: 'logisticavehiculospropios', component: VehiculoComponent, canActivate: [GuardiaService] },
  { path: 'logisticaproveedoresvehiculos', component: VehiculoProveedorComponent, canActivate: [GuardiaService] },
  { path: 'generalescompaniadeseguropolizas', component: CompaniaSeguroPolizaComponent, canActivate: [GuardiaService] },
  { path: 'reestablecertablastablarolsubopcion', component: RolSubopcionComponent, canActivate: [GuardiaService] },
  { path: 'reestablecertablastablarolopcion', component: RolOpcionComponent, canActivate: [GuardiaService] },
  { path: 'reestablecertablastablasubopcionpestania', component: SubopcionPestaniaComponent, canActivate: [GuardiaService] },
  { path: 'reestablecertablastablausuarioempresa', component: UsuarioEmpresaComponent, canActivate: [GuardiaService] },
  { path: 'organizacionempresas', component: EmpresaComponent, canActivate: [GuardiaService] },
  { path: 'guiasdeserviciosremitosgs', component: ViajeRemitoComponent, canActivate: [GuardiaService] },
  { path: 'guiasdeserviciosemisiongs', component: ViajeComponent, canActivate: [GuardiaService] },
  { path: 'listasdepreciosactualizaciondeprecios', component: ActualizacionPreciosComponent, canActivate: [GuardiaService] },
  { path: 'webservicesafipsolicitarcaeanticipado', component: CaeAnticipadoComponent, canActivate: [GuardiaService] },
  { path: 'webservicesafipconsultarestadodelservicio', component: EstadoServicioAfipComponent, canActivate: [GuardiaService] },
  { path: 'facturacionfacturas', component: EmitirFacturaComponent, canActivate: [GuardiaService] },
  { path: 'facturacionnotasdecredito', component: EmitirNotaCreditoComponent, canActivate: [GuardiaService] },
  { path: 'facturacionnotasdedebito', component: EmitirNotaDebitoComponent, canActivate: [GuardiaService] },
  { path: 'contablemonedas', component: MonedaComponent, canActivate: [GuardiaService] },
  { path: 'contablemonedascotizacion', component: MonedaCotizacionComponent, canActivate: [GuardiaService] },
  { path: 'contablemonedascuentacontable', component: MonedaCuentaContableComponent, canActivate: [GuardiaService] },
  { path: 'webservicesafipconsultarpuntosdevtaautorizados', component: PuntosVentaAutorizadoComponent, canActivate: [GuardiaService] },
  { path: 'repartosplanillassalientes', component: RepartoComponent, canActivate: [GuardiaService] },
  { path: 'repartosplanillasentrantes', component: RepartoEntranteComponent, canActivate: [GuardiaService] },
  { path: 'usuariosusuariosempresas', component: UsuarioEmpresasComponent, canActivate: [GuardiaService] },
  { path: 'rolesadministrarmenu', component: RolSubopcionMenuComponent, canActivate: [GuardiaService] },
  { path: 'logisticainsumosproductos', component: ProductoComponent, canActivate: [GuardiaService] },
  { path: 'logisticadepositosinsumosproductos', component: DepositoInsumoProductoComponent, canActivate: [GuardiaService] },
  { path: 'menuopciones', component: OpcionComponent, canActivate: [GuardiaService] },
  { path: 'plandecuentasdefinicion', component: PlanCuentaComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontiposdecomprobante', component: TipoComprobanteComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontiposdecontacto', component: TipoContactoComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontiposdedocumentos', component: TipoDocumentoComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontiposdeproveedor', component: TipoProveedorComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontiposdetarifa', component: TipoTarifaComponent, canActivate: [GuardiaService] },
  { path: 'configuracionafipconcepto', component: ConceptoAfipComponent, canActivate: [GuardiaService] },
  { path: 'configuracionventasconceptos', component: VentaConceptoComponent, canActivate: [GuardiaService] },
  { path: 'configuracionventatipoitem', component: VentaTipoComponent, canActivate: [GuardiaService] },
  { path: 'recoleccionesadministrar', component: OrdenRecoleccionComponent, canActivate: [GuardiaService] },
  { path: 'logisticaunidadesdenegocio', component: ViajeUnidadNegocioComponent, canActivate: [GuardiaService] },
  { path: 'contablecondicionesdeiva', component: AfipCondicionIvaComponent, canActivate: [GuardiaService] },
  { path: 'categoriasbasicos', component: BasicoCategoriaComponent, canActivate: [GuardiaService] },
  { path: 'soporte', component: SoporteComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontiposdefamiliares', component: TipoFamiliarComponent, canActivate: [GuardiaService] },
  { path: 'legajosfamiliares', component: PersonalFamiliarComponent, canActivate: [GuardiaService] },
  { path: 'usuarioscontrasenas', component: ContraseniaComponent, canActivate: [GuardiaService] },
  { path: 'contablecostosinsumosproductos', component: CostosInsumosProductoComponent, canActivate: [GuardiaService] },
  { path: 'contablecostosdeviajesgs', component: ViajeTipoComponent, canActivate: [GuardiaService] },
  { path: 'legajosvencimientoschoferes', component: VencimientosChoferesComponent, canActivate: [GuardiaService] },
  { path: 'cuentasbancariascuentas', component: CuentaBancariaComponent, canActivate: [GuardiaService] },
  { path: 'sindicatostipochequera', component: TipoChequeraComponent, canActivate: [GuardiaService] },
  { path: 'cuentasbancariaschequeras', component: ChequeraComponent, canActivate: [GuardiaService] },
  { path: 'gestiondecobrostalonariosreciboscobradores', component: TalonarioReciboCobradorComponent, canActivate: [GuardiaService] },
  { path: 'gestiondecobrostalonariosreciboslote', component: TalonarioReciboLoteComponent, canActivate: [GuardiaService] },
  { path: 'bugimagen', component: BugImagenDialogoComponent, canActivate: [GuardiaService] },
  { path: 'impuestoalasgananciasdeduccionesgeneralesdescripcion', component: DeduccionGeneralComponent, canActivate: [GuardiaService] },
  { path: 'impuestoalasgananciasdeduccionesgeneralestopes', component: DeduccionGeneralTopeComponent, canActivate: [GuardiaService] },
  { path: 'impuestoalasgananciasdeduccionespersonalesdescripcion', component: DeduccionPersonalComponent, canActivate: [GuardiaService] },
  { path: 'impuestoalasgananciasganancianetaescala', component: GananciaNetaComponent, canActivate: [GuardiaService] },
  { path: 'impuestoalasgananciasdeduccionespersonalestablas', component: DeduccionPersonalTablaComponent, canActivate: [GuardiaService] },
  { path: 'comprobantesproveedoresfacturasdebitosycreditos', component: FacturaDebitoCreditoComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontipodechequera', component: TipoChequeraComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontiporetencion', component: TipoRetencionComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontipopercepcion', component: TipoPercepcionComponent, canActivate: [GuardiaService] },
  { path: 'configuraciontipofamiliar', component: TipoFamiliarComponent, canActivate: [GuardiaService] },
  { path: 'adelantosadelantosenlote', component: AdelantoLoteComponent, canActivate: [GuardiaService] },
  { path: 'adelantosadministrar', component: AdelantoPersonalComponent, canActivate: [GuardiaService] },
]

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
    PaisComponent,
    LoginComponent,
    HomeComponent,
    UsuarioComponent,
    EmpresaComponent,
    PestaniaComponent,
    AgendaTelefonicaComponent,
    AreaComponent,
    BancoComponent,
    BarrioComponent,
    CategoriaComponent,
    CobradorComponent,
    CompaniaSeguroComponent,
    MarcaProductoComponent,
    MarcaVehiculoComponent,
    ModuloComponent,
    ObraSocialComponent,
    LocalidadComponent,
    OrigenDestinoComponent,
    ProvinciaComponent,
    RolComponent,
    RubroComponent,
    RubroProductoComponent,
    SeguridadSocialComponent,
    SexoComponent,
    SindicatoComponent,
    SituacionClienteComponent,
    SubmoduloComponent,
    SubopcionComponent,
    SucursalComponent,
    SucursalBancoComponent,
    TipoComprobanteComponent,
    TipoContactoComponent,
    TipoCuentaBancariaComponent,
    TipoDocumentoComponent,
    TipoProveedorComponent,
    TipoTarifaComponent,
    TipoVehiculoComponent,
    TramoComponent,
    UnidadMedidaComponent,
    VendedorComponent,
    ZonaComponent,
    ClienteComponent,
    ResumenClienteComponent,
    OrdenVentaComponent,
    ProveedorComponent,
    CondicionCompraComponent,
    PersonalComponent,
    EstadoCivilComponent,
    EscalaTarifaComponent,
    ChoferProveedorComponent,
    ConfiguracionVehiculoComponent,
    ContactoBancoComponent,
    ContactoClienteComponent,
    ContactoCompaniaSeguroComponent,
    ContactoProveedorComponent,
    PuntoVentaComponent,
    SucursalClienteComponent,
    VehiculoComponent,
    VehiculoProveedorComponent,
    CompaniaSeguroPolizaComponent,
    ViajeRemitoComponent,
    RolSubopcionComponent,
    RolOpcionComponent,
    RolSubopcionDialog,
    RolOpcionDialog,
    SubopcionPestaniaComponent,
    SubopcionPestaniaDialog,
    UsuarioEmpresaComponent,
    UsuarioEmpresaDialog,
    ViajeComponent,
    ActualizacionPreciosComponent,
    CaeAnticipadoComponent,
    EstadoServicioAfipComponent,
    EmitirFacturaComponent,
    EmitirNotaCreditoComponent,
    EmitirNotaDebitoComponent,
    MonedaComponent,
    MonedaCotizacionComponent,
    MonedaCuentaContableComponent,
    PlanCuentaDialogo,
    PuntosVentaAutorizadoComponent,
    RepartoComponent,
    CondicionVentaComponent,
    ProductoComponent,
    UsuarioEmpresasComponent,
    RolSubopcionMenuComponent,
    UsuarioDialogo,
    VistaPreviaDialogo,
    PestaniaDialogo,
    ConceptoAfipComponent,
    RepartoEntranteComponent,
    VentaConceptoComponent,
    ViajeUnidadNegocioComponent,
    OpcionComponent,
    DadorDestinatarioDialogo,
    DadorDestTablaDialogo,
    ObservacionesDialogo,
    ViajeTramoComponent,
    ViajeCombustibleComponent,
    ViajeEfectivoComponent,
    ViajeInsumoComponent,
    ViajeGastoComponent,
    ViajePeajeComponent,
    ViajeRemitoGSComponent,
    ListaUsuariosDialogo,
    CambiarMonedaPrincipalDialogo,
    CambiarCobradorPrincipalDialogo,
    ListaPreciosDialogo,
    ConfirmarDialogo,
    ViajeDialogo,
    PlanCuentaComponent,
    TipoCuentaContableComponent,
    GrupoCuentaContableComponent,
    EjercicioComponent,
    VentaTipoComponent,
    OrdenRecoleccionComponent,
    ClienteEventualComponent,
    AforoComponent,
    ObservacionDialogo,
    AnularDialogo,
    NormalizarDialogo,
    TotalCargaDialogo,
    TotalConceptoDialogo,
    ChequesRechazadosComponent,
    AcompanianteDialogo,
    AfipCondicionIvaComponent,
    BasicoCategoriaComponent,
    ProgresoComponent,
    ErrorPuntoVentaComponent,
    SoporteComponent,
    TipoFamiliarComponent,
    PersonalFamiliarComponent,
    ContraseniaComponent,
    CostosInsumosProductoComponent,
    ViajeTipoComponent,
    VencimientosChoferesComponent,
    CuentaBancariaComponent,
    TipoChequeraComponent,
    ChequeraComponent,
    DepositoInsumoProductoComponent,
    TalonarioReciboCobradorComponent,
    TalonarioReciboLoteComponent,
    VerTarifaDialogo,
    PdfDialogoComponent,
    ListasDePreciosDialog,
    BugImagenDialogoComponent,
    CambiarOVporDefectoDialogo,
    DeduccionGeneralComponent,
    DeduccionGeneralTopeComponent,
    DeduccionPersonalComponent,
    GananciaNetaComponent,
    DeduccionPersonalTablaComponent,
    ImporteAnualDialogo,
    FacturaDebitoCreditoComponent,
    AgregarItemDialogo,
    ConfirmarDialogoComponent,
    DetallePercepcionesDialogo,
    DetalleVencimientosDialogo,
    TipoRetencionComponent,
    TipoPercepcionComponent,
    AdelantoLoteComponent,
    CuentaBancariaDialogoComponent,
    AdelantoLoteDialogo,
    AdelantoPersonalComponent,
    PrestamoDialogo,
    ReporteDialogoComponent,
    DetalleAdelantoDialogo
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatDividerModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatInputModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatTableModule,
    MatDialogModule,
    MatProgressBarModule,
    MatStepperModule,
    MatTreeModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatListModule,
    TextMaskModule,
    PdfViewerModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatSortModule
  ],
  providers: [
    AfipActividadService,
    AfipComprobanteService,
    AfipCondicionService,
    AfipLocalidadService,
    AfipModContratacionService,
    AfipSiniestradoService,
    AfipSituacionService,
    AfipCondicionIvaService,
    AgendaTelefonicaService,
    AppService,
    AreaService,
    AfipConceptoService,
    BancoService,
    BarrioService,
    CategoriaService,
    Cliente,
    ClienteService,
    ChoferProveedorService,
    CompaniaSeguroPolizaService,
    CompaniaSeguroPoliza,
    CondicionVentaService,
    ConfiguracionVehiculoService,
    ContactoBancoService,
    ContactoClienteService,
    ContactoCompaniaSeguroService,
    ContactoProveedorService,
    CobradorService,
    CompaniaSeguroService,
    CondicionCompraService,
    CondicionCompra,
    CondicionVenta,
    configuracionVehiculo,
    EjercicioService,
    Ejercicio,
    Empresa,
    EmpresaService,
    EstadoCivilService,
    EscalaTarifaService,
    FechaService,
    GuardiaService,
    GrupoCuentaContable,
    GrupoCuentaContableService,
    InsumoProductoService,
    LocalidadService,
    LoginService,
    MarcaProductoService,
    MarcaVehiculoService,
    ModuloService,
    MonedaCotizacionService,
    MonedaCotizacion,
    MonedaCuentaContable,
    MonedaService,
    MonedaCuentaContableService,
    Moneda,
    NotaCredito,
    NotaDebito,
    OrdenVenta,
    OrdenVentaEscala,
    OrdenVentaTramo,
    OpcionService,
    ObraSocialService,
    OrigenDestinoService,
    OrdenVentaService,
    OrdenVentaEscalaService,
    OrdenVentaTramoService,
    ProveedorService,
    Proveedor,
    PersonalService,
    PuntoVentaService,
    PaisService,
    ProvinciaService,
    PlanCuentaService,
    Producto,
    ProductoService,
    Reparto,
    RepartoEntrante,
    RolOpcionService,
    ResumenClienteService,
    RolService,
    RolSubopcionService,
    RubroService,
    RubroProductoService,
    SeguridadSocialService,
    SexoService,
    SindicatoService,
    SituacionClienteService,
    SubmoduloService,
    SubopcionService,
    SubopcionPestaniaService,
    SucursalService,
    SucursalBancoService,
    SucursalClienteService,
    TipoComprobanteService,
    TipoContactoService,
    TipoCuentaBancariaService,
    TipoDocumentoService,
    TipoProveedorService,
    TipoTarifaService,
    TipoVehiculoService,
    TramoService,
    UnidadMedidaService,
    UsuarioService,
    VendedorService,
    ViajeService,
    VehiculoService,
    Vehiculo,
    VehiculoProveedorService,
    UsuarioEmpresa,
    UsuarioEmpresaService,
    ViajeRemitoService,
    ViajePrecioService,
    ViajeTarifaService,
    ViajeTipoCargaService,
    ViajeTipoService,
    ViajeTramoClienteService,
    ViajeUnidadNegocioService,
    Viaje,
    ViajeTramo,
    ViajeTramoCliente,
    ViajeCombustible,
    ViajeEfectivo,
    ViajeInsumo,
    ViajeRemito,
    ViajeGasto,
    ViajePeaje,
    VentaConcepto,
    VentaTipoItem,
    VentaTipoItemService,
    ViajeUnidadNegocio,
    ZonaService,
    TipoCuentaBancaria,
    TipoCuentaContable,
    TipoCuentaContableService,
    StompService,
    ConceptoAfip,
    ActualizacionPrecios,
    OrdenRecoleccion,
    OrdenRecoleccionService,
    ClienteEventual,
    EmitirFactura,
    ViajeTramoService,
    ViajeTerceroTramoService,
    VentaItemConceptoService,
    VentaConfigService,
    AfipAlicuotaIvaService,
    VentaComprobanteService,
    VentaComprobanteItemNCService,
    VentaComprobanteItemNDService,
    ViajeService,
    RepartoTerceroService,
    RetiroDepositoService,
    BasicoCategoriaService,
    RepartoTerceroComprobanteService,
    RepartoPropioComprobanteService,
    RetiroDepositoComprobanteService,
    TipoFamiliarService,
    Aforo,
    ChoferProveedor,
    Personal,
    PuntoVenta,
    Categoria,
    TipoFamiliar,
    Usuario,
    BasicoCategoria,
    AfipCondicionIva,
    MesService,
    ViajeCombustibleService,
    ViajeEfectivoService,
    ViajeInsumoService,
    ViajeGastoService,
    ViajePeajeService,
    LoaderService,
    PersonalFamiliarService,
    PersonalFamiliar,
    InsumoProducto,
    ViajeTipo,
    Cobrador,
    CuentaBancaria,
    TipoChequera,
    TipoChequeraService,
    Chequera,
    ChequeraService,
    CuentaBancariaService,
    DepositoInsumoProducto,
    TalonarioReciboCobrador,
    DepositoInsumoProductoService,
    TalonarioReciboService,
    TalonarioReciboLoteService,
    SoporteService,
    Soporte,
    MensajeExcepcion,
    TalonarioReciboLote,
    FotoService,
    OrdenVentaTarifa,
    OrdenVentaTarifaService,
    Foto,
    Viaje,
    Pdf,
    BugImagen,
    ClienteOrdenVentaService,
    CompraComprobante,
    CompraComprobanteItem,
    CompraComprobantePercepcion,
    CompraComprobantePercepcionJurisdiccion,
    OrdenVentaCliente,
    OrdenVentaEmpresa,
    AfipDeduccionGeneralService,
    AfipDeduccionGeneral,
    AfipDeduccionGeneralTopeService,
    AfipDeduccionGeneralTope,
    AfipDeduccionPersonalService,
    AfipDeduccionPersonal,
    AfipGananciaNetaService,
    AfipGananciaNeta,
    AfipAlicuotaGananciaService,
    AfipDeduccionPersonalTabla,
    AfipTipoBeneficioDeduccionService,
    AfipTipoBeneficioService,
    FacturaDebitoCredito,
    CompraComprobanteVencimiento,
    CompraComprobanteService,
    TipoPercepcionService,
    TipoRetencion,
    TipoRetencionService,
    CompraComprobanteVencimientoService,
    PersonalAdelanto,
    TipoPercepcion,
    PersonalAdelantoService,
    DatePipe,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    RolSubopcionDialog,
    RolOpcionDialog,
    SubopcionPestaniaDialog,
    UsuarioEmpresaDialog,
    UsuarioDialogo,
    VistaPreviaDialogo,
    PestaniaDialogo,
    DadorDestinatarioDialogo,
    DadorDestTablaDialogo,
    ObservacionesDialogo,
    ListaUsuariosDialogo,
    CambiarMonedaPrincipalDialogo,
    CambiarCobradorPrincipalDialogo,
    CambiarOVporDefectoDialogo,
    ListaPreciosDialogo,
    ConfirmarDialogo,
    ViajeDialogo,
    ClienteEventualComponent,
    AforoComponent,
    ObservacionDialogo,
    TotalCargaDialogo,
    TotalConceptoDialogo,
    ChequesRechazadosComponent,
    AcompanianteDialogo,
    ErrorPuntoVentaComponent,
    PersonalFamiliarComponent,
    PlanCuentaDialogo,
    VerTarifaDialogo,
    ListasDePreciosDialog,
    ConfirmarDialogoComponent,
    PdfDialogoComponent,
    BugImagenDialogoComponent,
    AnularDialogo,
    NormalizarDialogo,
    ImporteAnualDialogo,
    AgregarItemDialogo,
    DetallePercepcionesDialogo,
    DetalleVencimientosDialogo,
    CuentaBancariaDialogoComponent,
    AdelantoLoteDialogo,
    PrestamoDialogo,
    ReporteDialogoComponent,
    DetalleAdelantoDialogo
  ]
})
export class AppModule { }