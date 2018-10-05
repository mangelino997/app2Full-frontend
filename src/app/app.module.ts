import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatMenuModule, MatToolbarModule, MatDividerModule,
  MatSelectModule, MatTabsModule, MatIconModule, MatCardModule, MatSidenavModule,
  MatAutocompleteModule, MatInputModule} from '@angular/material';
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
import { PestaniaService } from './servicios/pestania.service';
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

//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { PaisComponent } from './componentes/pais/pais.component';
import { HomeComponent } from './componentes/home/home.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { EmpresaComponent } from './componentes/empresa/empresa.component';
import { PestaniaComponent } from './componentes/pestania/pestania.component';
import { AgendaTelefonicaComponent } from './componentes/agenda-telefonica/agenda-telefonica.component';
import { AreaComponent } from './componentes/area/area.component';
import { BancoComponent } from './componentes/banco/banco.component';
import { BarrioComponent } from './componentes/barrio/barrio.component';
import { CategoriaComponent } from './componentes/categoria/categoria.component';
import { CobradorComponent } from './componentes/cobrador/cobrador.component';
import { CompaniaSeguroComponent } from './componentes/compania-seguro/compania-seguro.component';
import { MarcaProductoComponent } from './componentes/marca-producto/marca-producto.component';
import { MarcaVehiculoComponent } from './componentes/marca-vehiculo/marca-vehiculo.component';
import { ModuloComponent } from './componentes/modulo/modulo.component';
import { ObraSocialComponent } from './componentes/obra-social/obra-social.component';
import { LocalidadComponent } from './componentes/localidad/localidad.component';
import { OrigenDestinoComponent } from './componentes/origen-destino/origen-destino.component';
import { ProvinciaComponent } from './componentes/provincia/provincia.component';
import { RolComponent } from './componentes/rol/rol.component';
import { RubroComponent } from './componentes/rubro/rubro.component';
import { RubroProductoComponent } from './componentes/rubro-producto/rubro-producto.component';
import { SeguridadSocialComponent } from './componentes/seguridad-social/seguridad-social.component';
import { SexoComponent } from './componentes/sexo/sexo.component';
import { SindicatoComponent } from './componentes/sindicato/sindicato.component';
import { SituacionClienteComponent } from './componentes/situacion-cliente/situacion-cliente.component';
import { SubmoduloComponent } from './componentes/submodulo/submodulo.component';
import { SubopcionComponent } from './componentes/subopcion/subopcion.component';
import { SucursalComponent } from './componentes/sucursal/sucursal.component';
import { SucursalBancoComponent } from './componentes/sucursal-banco/sucursal-banco.component';
import { TipoComprobanteComponent } from './componentes/tipo-comprobante/tipo-comprobante.component';
import { TipoContactoComponent } from './componentes/tipo-contacto/tipo-contacto.component';
import { TipoCuentaBancariaComponent } from './componentes/tipo-cuenta-bancaria/tipo-cuenta-bancaria.component';
import { TipoDocumentoComponent } from './componentes/tipo-documento/tipo-documento.component';
import { TipoProveedorComponent } from './componentes/tipo-proveedor/tipo-proveedor.component';
import { TipoTarifaComponent } from './componentes/tipo-tarifa/tipo-tarifa.component';
import { TipoVehiculoComponent } from './componentes/tipo-vehiculo/tipo-vehiculo.component';
import { TramoComponent } from './componentes/tramo/tramo.component';
import { UnidadMedidaComponent } from './componentes/unidad-medida/unidad-medida.component';
import { VendedorComponent } from './componentes/vendedor/vendedor.component';
import { ZonaComponent } from './componentes/zona/zona.component';
import { ClienteComponent } from './componentes/cliente/cliente.component';
import { ResumenClienteComponent } from './componentes/resumen-cliente/resumen-cliente.component';
import { OrdenVentaComponent } from './componentes/orden-venta/orden-venta.component';
import { ProveedorComponent } from './componentes/proveedor/proveedor.component';
import { CondicionCompraComponent } from './componentes/condicion-compra/condicion-compra.component';
import { PersonalComponent } from './componentes/personal/personal.component';
import { EstadoCivilComponent } from './componentes/estado-civil/estado-civil.component';
import { EscalaTarifaComponent } from './componentes/escala-tarifa/escala-tarifa.component';
import { ChoferProveedorComponent } from './componentes/chofer-proveedor/chofer-proveedor.component';
import { ConfiguracionVehiculoComponent } from './componentes/configuracion-vehiculo/configuracion-vehiculo.component';
import { ContactoBancoComponent } from './componentes/contacto-banco/contacto-banco.component';

//Rutas
const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [GuardiaService]},
  {path: 'generalespaises', component: PaisComponent, canActivate: [GuardiaService]},
  {path: 'generalesagendatelefonica', component: AgendaTelefonicaComponent, canActivate: [GuardiaService]},
  {path: 'area', component: AreaComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'contablebancos', component: BancoComponent, canActivate: [GuardiaService]},
  {path: 'generalesbarrios', component: BarrioComponent, canActivate: [GuardiaService]},
  {path: 'categoriasadministrar', component: CategoriaComponent, canActivate: [GuardiaService]},
  {path: 'generalescobradores', component: CobradorComponent, canActivate: [GuardiaService]},
  {path: 'companiaseguro', component: CompaniaSeguroComponent, canActivate: [GuardiaService]},//Revisar
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
  {path: 'ordenventa', component: OrdenVentaComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'generalesproveedores', component: ProveedorComponent, canActivate: [GuardiaService]},
  {path: 'condicioncompra', component: CondicionCompraComponent, canActivate: [GuardiaService]},//Revisar
  {path: 'legajosadministraractivos', component: PersonalComponent, canActivate: [GuardiaService]},
  {path: 'listasdepreciosescaladetarifas', component: EscalaTarifaComponent, canActivate: [GuardiaService]},
  {path: 'choferproveedor', component: ChoferProveedorComponent, canActivate: [GuardiaService]},//VER
  {path: 'configuracionvehiculo', component: ConfiguracionVehiculoComponent, canActivate: [GuardiaService]},//VER
  {path: 'contactobanco', component: ContactoBancoComponent, canActivate: [GuardiaService]}//VER
]

const stompConfig: StompConfig = {
  url: 'ws://127.0.0.1:8080/jit/socket',
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
    ContactoBancoComponent
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
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
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
    PestaniaService,
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
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
