import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatToolbarModule, MatDividerModule,
  MatSelectModule, MatTabsModule, MatIconModule, MatCardModule, MatSidenavModule,
  MatAutocompleteModule, MatInputModule, MatRadioModule, MatTableModule, MatDialogModule,
  MatProgressBarModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';


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
import { CondicionIvaService } from './servicios/condicion-iva.service';
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
import { ViajePropioService } from './servicios/viaje-propio.service';
import { FechaService } from './servicios/fecha.service';
import { VehiculoService } from './servicios/vehiculo.service';
import { VehiculoProveedorService } from './servicios/vehiculo-proveedor.service';
import { CompaniaSeguroPolizaService } from './servicios/compania-seguro-poliza.service';
import { CondicionVentaService } from './servicios/condicion-venta.service';
import { RolSubopcionService } from './servicios/rol-subopcion.service';
import { UsuarioEmpresaService } from './servicios/usuario-empresa.service';
import { ViajeRemitoService } from './servicios/viaje-remito.service';
import { InsumoService } from './servicios/insumo.service';
import { ViajePrecioService } from './servicios/viaje-precio.service';
import { ViajeTarifaService } from './servicios/viaje-tarifa.service';
import { ViajeTipoCargaService } from './servicios/viaje-tipo-carga.service';
import { ViajeTipoService } from './servicios/viaje-tipo.service';
import { ViajeTramoClienteService } from './servicios/viaje-tramo-cliente.service';
import { ViajeTramoService } from './servicios/viaje-tramo.service';
import { ViajeUnidadNegocioService } from './servicios/viaje-unidad-negocio.service';

//Modelos
import { ViajePropio } from './modelos/viajePropio';
import { ViajePropioTramo } from './modelos/viajePropioTramo';
import { ViajePropioTramoCliente } from './modelos/viajePropioTramoCliente';
import { ViajePropioCombustible } from './modelos/viajePropioCombustible';
import { ViajePropioEfectivo } from './modelos/viajePropioEfectivo';
import { ViajePropioInsumo } from './modelos/viajePropioInsumo';
import { ViajeRemito } from './modelos/viajeRemito';
import { ViajePropioGasto } from './modelos/viajePropioGasto';
import { ViajePropioPeaje } from './modelos/viajePropioPeaje';
import { NotaCredito } from './modelos/notaCredito';
import { NotaDebito } from './modelos/notaDebito';

//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { PaisComponent } from './componentes/pais/pais.component'; //Probado
import { HomeComponent } from './componentes/home/home.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { EmpresaComponent } from './componentes/empresa/empresa.component';
import { PestaniaComponent } from './componentes/pestania/pestania.component';
import { AgendaTelefonicaComponent } from './componentes/agenda-telefonica/agenda-telefonica.component'; //Probado
import { AreaComponent } from './componentes/area/area.component';
import { BancoComponent } from './componentes/banco/banco.component'; //Probado
import { BarrioComponent } from './componentes/barrio/barrio.component'; //Probado
import { CategoriaComponent } from './componentes/categoria/categoria.component'; //Probado
import { CobradorComponent } from './componentes/cobrador/cobrador.component'; //Probado
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
import { ClienteComponent } from './componentes/cliente/cliente.component'; //Probado
import { ResumenClienteComponent } from './componentes/resumen-cliente/resumen-cliente.component';
import { OrdenVentaComponent } from './componentes/orden-venta/orden-venta.component';
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
import { ActualizacionPreciosComponent } from './componentes/actualizacion-precios/actualizacion-precios.component';
import { CaeAnticipadoComponent } from './componentes/cae-anticipado/cae-anticipado.component';
import { EstadoServicioAfipComponent } from './componentes/estado-servicio-afip/estado-servicio-afip.component';
import { EmitirFacturaComponent } from './componentes/emitir-factura/emitir-factura.component';
import { EmitirNotaCreditoComponent } from './componentes/emitir-nota-credito/emitir-nota-credito.component';
import { EmitirNotaDebitoComponent } from './componentes/emitir-nota-debito/emitir-nota-debito.component';

//Rutas
const appRoutes: Routes = [
  {path: '', component: EmitirNotaDebitoComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [GuardiaService]},
  {path: 'generalespaises', component: PaisComponent, canActivate: [GuardiaService]},
  {path: 'generalesagendatelefonica', component: AgendaTelefonicaComponent, canActivate: [GuardiaService]},
  {path: 'area', component: AreaComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'contablebancos', component: BancoComponent, canActivate: [GuardiaService]},
  {path: 'generalesbarrios', component: BarrioComponent, canActivate: [GuardiaService]},
  {path: 'categoriasadministrar', component: CategoriaComponent, canActivate: [GuardiaService]},
  {path: 'generalescobradores', component: CobradorComponent, canActivate: [GuardiaService]},
  {path: 'generalescompaniadeseguro', component: CompaniaSeguroComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'generaleslocalidades', component: LocalidadComponent, canActivate: [GuardiaService]},
  {path: 'logisticamarcasproductos', component: MarcaProductoComponent, canActivate: [GuardiaService]},
  {path: 'logisticamarcasvehiculos', component: MarcaVehiculoComponent, canActivate: [GuardiaService]},
  {path: 'menumodulos', component: ModuloComponent, canActivate: [GuardiaService]},
  {path: 'obrassocialesadministrar', component: ObraSocialComponent, canActivate: [GuardiaService]},
  {path: 'origenesdestinosadministrar', component: OrigenDestinoComponent, canActivate: [GuardiaService]},
  {path: 'generalesprovincias', component: ProvinciaComponent, canActivate: [GuardiaService]},
  {path: 'rolesadministrar', component: RolComponent, canActivate: [GuardiaService]},
  {path: 'generalesrubros', component: RubroComponent, canActivate: [GuardiaService]},
  {path: 'logisticarubrosproductos', component: RubroProductoComponent, canActivate: [GuardiaService]},
  {path: 'orgprevisionalesadministrar', component: SeguridadSocialComponent, canActivate: [GuardiaService]},
  {path: 'sexo', component: SexoComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'sindicatosadministrar', component: SindicatoComponent, canActivate: [GuardiaService]},
  {path: 'situacioncliente', component: SituacionClienteComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'menusubmodulos', component: SubmoduloComponent, canActivate: [GuardiaService]},
  {path: 'menusubopciones', component: SubopcionComponent, canActivate: [GuardiaService]},
  {path: 'organizacionsucursales', component: SucursalComponent, canActivate: [GuardiaService]},
  {path: 'contablebancossucursales', component: SucursalBancoComponent, canActivate: [GuardiaService]},
  {path: 'generalesclientessucursales', component: SucursalClienteComponent, canActivate: [GuardiaService]},
  {path: 'tipocomprobante', component: TipoComprobanteComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'tipocontacto', component: TipoContactoComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'tipocuentabancaria', component: TipoCuentaBancariaComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'tipodocumento', component: TipoDocumentoComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'tipoproveedor', component: TipoProveedorComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'tipotarifa', component: TipoProveedorComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'logisticatiposdevehiculos', component: TipoVehiculoComponent, canActivate: [GuardiaService]},
  {path: 'origenesdestinostramos', component: TramoComponent, canActivate: [GuardiaService]},
  {path: 'unidadmedida', component: UnidadMedidaComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'usuariosadministrar', component: UsuarioComponent, canActivate: [GuardiaService]},
  {path: 'vendedor', component: VendedorComponent, canActivate: [GuardiaService]},//revisar
  {path: 'generaleszonas', component: ZonaComponent, canActivate: [GuardiaService]},
  {path: 'generalesclientes', component: ClienteComponent, canActivate: [GuardiaService]},
  {path: 'listasdepreciosordenesdeventa', component: OrdenVentaComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'generalesproveedores', component: ProveedorComponent, canActivate: [GuardiaService]},
  {path: 'condicioncompra', component: CondicionCompraComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'legajosadministraractivos', component: PersonalComponent, canActivate: [GuardiaService]},
  {path: 'listasdepreciosescaladetarifas', component: EscalaTarifaComponent, canActivate: [GuardiaService]},
  {path: 'logisticaproveedoreschoferes', component: ChoferProveedorComponent, canActivate: [GuardiaService]},
  {path: 'logisticavehiculospropiosconfiguracion', component: ConfiguracionVehiculoComponent, canActivate: [GuardiaService]},
  {path: 'contablebancoscontactos', component: ContactoBancoComponent, canActivate: [GuardiaService]},
  {path: 'generalesclientescontactos', component: ContactoClienteComponent, canActivate: [GuardiaService]},
  {path: 'generalescompaniadesegurocontactos', component: ContactoCompaniaSeguroComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'generalesproveedorescontactos', component: ContactoProveedorComponent, canActivate: [GuardiaService]},
  {path: 'puntosdeventaadministrar', component: PuntoVentaComponent, canActivate: [GuardiaService]},
  {path: 'logisticavehiculospropios', component: VehiculoComponent, canActivate: [GuardiaService]},
  {path: 'logisticaproveedoresvehiculos', component: VehiculoProveedorComponent, canActivate: [GuardiaService]},
  {path: 'generalescompaniadeseguropolizas', component: CompaniaSeguroPolizaComponent, canActivate: [GuardiaService]},
  {path: 'reestablecertablastablarolsubopcion', component: RolSubopcionComponent, canActivate: [GuardiaService]},
  {path: 'reestablecertablastablasubopcionpestania', component: SubopcionPestaniaComponent, canActivate: [GuardiaService]},
  {path: 'reestablecertablastablausuarioempresa', component: UsuarioEmpresaComponent, canActivate: [GuardiaService]},
  {path: 'organizacionempresas', component: EmpresaComponent, canActivate: [GuardiaService]},
  {path: 'guiasdeserviciosremitosgs', component: ViajeRemitoComponent, canActivate: [GuardiaService]},
  {path: 'guiasdeserviciosemisiongs', component: ViajeComponent, canActivate: [GuardiaService]}
]

const stompConfig: StompConfig = {
  url: 'ws://192.168.0.99:8080/jitws/socket',
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
    RolSubopcionDialog,
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
    EmitirNotaDebitoComponent
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
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 3000,
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
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  providers: [
    AppService,
    LoginService,
    GuardiaService,
    UsuarioService,
    PaisService,
    ProvinciaService,
    LocalidadService,
    EmpresaService,
    SubopcionPestaniaService,
    AgendaTelefonicaService,
    AreaService,
    BancoService,
    BarrioService,
    CategoriaService,
    CobradorService,
    CompaniaSeguroService,
    MarcaProductoService,
    MarcaVehiculoService,
    ModuloService,
    ObraSocialService,
    OrigenDestinoService,
    RolService,
    RubroService,
    RubroProductoService,
    SeguridadSocialService,
    SexoService,
    SindicatoService,
    SituacionClienteService,
    SubmoduloService,
    SubopcionService,
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
    VendedorService,
    ZonaService,
    ClienteService,
    RolOpcionService,
    CondicionIvaService,
    ResumenClienteService,
    OrdenVentaService,
    ProveedorService,
    CondicionCompraService,
    PersonalService,
    EstadoCivilService,
    AfipActividadService,
    AfipComprobanteService,
    AfipCondicionService,
    AfipLocalidadService,
    AfipModContratacionService,
    AfipSiniestradoService,
    AfipSituacionService,
    EscalaTarifaService,
    ChoferProveedorService,
    ConfiguracionVehiculoService,
    ContactoBancoService,
    ContactoClienteService,
    ContactoCompaniaSeguroService,
    ContactoProveedorService,
    PuntoVentaService,
    OrdenVentaEscalaService,
    ViajePropioService,
    FechaService,
    VehiculoService,
    VehiculoProveedorService,
    CompaniaSeguroPolizaService,
    CondicionVentaService,
    RolSubopcionService,
    UsuarioEmpresaService,
    ViajeRemitoService,
    InsumoService,
    ViajePrecioService,
    ViajeTarifaService,
    ViajeTipoCargaService,
    ViajeTipoService,
    ViajeTramoClienteService,
    ViajeTramoService,
    ViajeUnidadNegocioService,
    ViajePropio,
    ViajePropioTramo,
    ViajePropioTramoCliente,
    ViajePropioCombustible,
    ViajePropioEfectivo,
    ViajePropioInsumo,
    ViajeRemito,
    NotaCredito,
    NotaDebito,
    ViajePropioGasto,
    ViajePropioPeaje,
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [RolSubopcionDialog, SubopcionPestaniaDialog, UsuarioEmpresaDialog]
})
export class AppModule { }
