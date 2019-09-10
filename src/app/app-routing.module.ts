import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardiaService } from './servicios/guardia.service';
import { LoginComponent } from './componentes/login/login.component';

//Rutas
const routes: Routes = [
    {path: 'login', component: LoginComponent},
    // { path: 'login', loadChildren: () => import('./modulos/login/login.module').then(m => m.LoginModule) },
    { path: 'home', loadChildren: () => import('./modulos/home/home.module').then(m => m.HomeModule), canActivate: [GuardiaService] },
    { path: 'generalespaises', loadChildren: () => import('./modulos/pais/pais.module').then(m => m.PaisModule), canActivate: [GuardiaService] },
    { path: 'generalesagendatelefonica', loadChildren: () => import('./modulos/agenda-telefonica/agenda-telefonica.module').then(m => m.AgendaTelefonicaModule), canActivate: [GuardiaService] },
    { path: 'legajosareas', loadChildren: () => import('./modulos/area/area.module').then(m => m.AreaModule), canActivate: [GuardiaService] },
    { path: 'contablebancos', loadChildren: () => import('./modulos/banco/banco.module').then(m => m.BancoModule), canActivate: [GuardiaService] },
    { path: 'generalesbarrios', loadChildren: () => import('./modulos/barrio/barrio.module').then(m => m.BarrioModule), canActivate: [GuardiaService] },
    { path: 'categoriasadministrar', loadChildren: () => import('./modulos/categoria/categoria.module').then(m => m.CategoriaModule), canActivate: [GuardiaService] },
    { path: 'generalescobradores', loadChildren: () => import('./modulos/cobrador/cobrador.module').then(m => m.CobradorModule), canActivate: [GuardiaService] },
    { path: 'generalescompaniadeseguro', loadChildren: () => import('./modulos/compania-seguro/compania-seguro.module').then(m => m.CompaniaSeguroModule), canActivate: [GuardiaService] },
    { path: 'generaleslocalidades', loadChildren: () => import('./modulos/localidad/localidad.module').then(m => m.LocalidadModule), canActivate: [GuardiaService] },
    { path: 'logisticamarcasproductos', loadChildren: () => import('./modulos/marca-producto/marca-producto.module').then(m => m.MarcaProductoModule), canActivate: [GuardiaService] },
    { path: 'logisticamarcasvehiculos', loadChildren: () => import('./modulos/marca-vehiculo/marca-vehiculo.module').then(m => m.MarcaVehiculoModule), canActivate: [GuardiaService] },
    { path: 'menumodulos', loadChildren: () => import('./modulos/modulo/modulo.module').then(m => m.ModuloModule), canActivate: [GuardiaService] },
    { path: 'obrassocialesadministrar', loadChildren: () => import('./modulos/obra-social/obra-social.module').then(m => m.ObraSocialModule), canActivate: [GuardiaService] },
    { path: 'origenesdestinosadministrar', loadChildren: () => import('./modulos/origen-destino/origen-destino.module').then(m => m.OrigenDestinoModule), canActivate: [GuardiaService] },
    { path: 'generalesprovincias', loadChildren: () => import('./modulos/provincia/provincia.module').then(m => m.ProvinciaModule), canActivate: [GuardiaService] },
    { path: 'rolesadministrar', loadChildren: () => import('./modulos/rol/rol.module').then(m => m.RolModule), canActivate: [GuardiaService] },
    { path: 'generalesrubros', loadChildren: () => import('./modulos/rubro/rubro.module').then(m => m.RubroModule), canActivate: [GuardiaService] },
    { path: 'listasdepreciosactualizaciondeprecios', loadChildren: () => import('./modulos/actualizacion-precios/actualizacion-precios.module').then(m => m.ActualizacionPreciosModule), canActivate: [GuardiaService] },
    { path: 'logisticarubrosproductos', loadChildren: () => import('./modulos/rubro-producto/rubro-producto.module').then(m => m.RubroProductoModule), canActivate: [GuardiaService] },
    { path: 'orgprevisionalesadministrar', loadChildren: () => import('./modulos/seguridad-social/seguridad-social.module').then(m => m.SeguridadSocialModule), canActivate: [GuardiaService] },
    { path: 'sexo', loadChildren: () => import('./modulos/sexo/sexo.module').then(m => m.SexoModule), canActivate: [GuardiaService] },
    { path: 'sindicatosadministrar', loadChildren: () => import('./modulos/sindicato/sindicato.module').then(m => m.SindicatoModule), canActivate: [GuardiaService] },
    { path: 'situacioncliente', loadChildren: () => import('./modulos/situacion-cliente/situacion-cliente.module').then(m => m.SituacionClienteModule), canActivate: [GuardiaService] },
    { path: 'menusubmodulos', loadChildren: () => import('./modulos/submodulo/submodulo.module').then(m => m.SubmoduloModule), canActivate: [GuardiaService] },
    { path: 'menusubopciones', loadChildren: () => import('./modulos/subopcion/subopcion.module').then(m => m.SubopcionModule), canActivate: [GuardiaService] },
    { path: 'organizacionsucursales', loadChildren: () => import('./modulos/sucursal/sucursal.module').then(m => m.SucursalModule), canActivate: [GuardiaService] },
    { path: 'contablebancossucursales', loadChildren: () => import('./modulos/sucursal-banco/sucursal-banco.module').then(m => m.SucursalBancoModule), canActivate: [GuardiaService] },
    { path: 'generalesclientessucursales', loadChildren: () => import('./modulos/sucursal-cliente/sucursal-cliente.module').then(m => m.SucursalClienteModule), canActivate: [GuardiaService] },
    { path: 'configuraciontiposdecuentabancaria', loadChildren: () => import('./modulos/tipo-cuenta-bancaria/tipo-cuenta-bancaria.module').then(m => m.TipoCuentaBancariaModule), canActivate: [GuardiaService] },
    { path: 'configuraciontiposdecuentascontables', loadChildren: () => import('./modulos/tipo-cuenta-contable/tipo-cuenta-contable.module').then(m => m.TipoCuentaContableModule), canActivate: [GuardiaService] },
    { path: 'ejerciciosadministrar', loadChildren: () => import('./modulos/ejercicio/ejercicio.module').then(m => m.EjercicioModule), canActivate: [GuardiaService] },
    { path: 'logisticatiposdevehiculos', loadChildren: () => import('./modulos/tipo-vehiculo/tipo-vehiculo.module').then(m => m.TipoVehiculoModule), canActivate: [GuardiaService] },
    { path: 'origenesdestinostramos', loadChildren: () => import('./modulos/tramo/tramo.module').then(m => m.TramoModule), canActivate: [GuardiaService] },
    { path: 'configuraciontiposdemedida', loadChildren: () => import('./modulos/unidad-medida/unidad-medida.module').then(m => m.UnidadMedidaModule), canActivate: [GuardiaService] },
    { path: 'usuariosadministrar', loadChildren: () => import('./modulos/usuario/usuario.module').then(m => m.UsuarioModule), canActivate: [GuardiaService] },
    { path: 'vendedor', loadChildren: () => import('./modulos/vendedor/vendedor.module').then(m => m.VendedorModule), canActivate: [GuardiaService] },
    { path: 'generaleszonas', loadChildren: () => import('./modulos/zona/zona.module').then(m => m.ZonaModule), canActivate: [GuardiaService] },
    { path: 'generalesclientes', loadChildren: () => import('./modulos/cliente/cliente.module').then(m => m.ClienteModule), canActivate: [GuardiaService] },
    { path: 'listasdepreciosordenesdeventa', loadChildren: () => import('./modulos/orden-venta/orden-venta.module').then(m => m.OrdenVentaModule), canActivate: [GuardiaService] },
    { path: 'generalesproveedores', loadChildren: () => import('./modulos/proveedor/proveedor.module').then(m => m.ProveedorModule), canActivate: [GuardiaService] },
    { path: 'contablecondicionesdecompra', loadChildren: () => import('./modulos/condicion-compra/condicion-compra.module').then(m => m.CondicionCompraModule), canActivate: [GuardiaService] },
    { path: 'contablecondicionesdeventa', loadChildren: () => import('./modulos/condicion-venta/condicion-venta.module').then(m => m.CondicionVentaModule), canActivate: [GuardiaService] },
    { path: 'legajosadministraractivos', loadChildren: () => import('./modulos/personal/personal.module').then(m => m.PersonalModule), canActivate: [GuardiaService] },
    { path: 'listasdepreciosescaladetarifas', loadChildren: () => import('./modulos/escala-tarifa/escala-tarifa.module').then(m => m.EscalaTarifaModule), canActivate: [GuardiaService] },
    { path: 'logisticaproveedoreschoferes', loadChildren: () => import('./modulos/chofer-proveedor/chofer-proveedor.module').then(m => m.ChoferProveedorModule), canActivate: [GuardiaService] },
    { path: 'logisticavehiculospropiosconfiguracion', loadChildren: () => import('./modulos/configuracion-vehiculo/configuracion-vehiculo.module').then(m => m.ConfiguracionVehiculoModule), canActivate: [GuardiaService] },
    { path: 'contablebancoscontactos', loadChildren: () => import('./modulos/contacto-banco/contacto-banco.module').then(m => m.ContactoBancoModule), canActivate: [GuardiaService] },
    { path: 'generalesclientescontactos', loadChildren: () => import('./modulos/contacto-cliente/contacto-cliente.module').then(m => m.ContactoClienteModule), canActivate: [GuardiaService] },
    { path: 'generalescompaniadesegurocontactos', loadChildren: () => import('./modulos/contacto-compania-seguro/contacto-compania-seguro.module').then(m => m.ContactoCompaniaSeguroModule), canActivate: [GuardiaService] },
    { path: 'generalesproveedorescontactos', loadChildren: () => import('./modulos/contacto-proveedor/contacto-proveedor.module').then(m => m.ContactoProveedorModule), canActivate: [GuardiaService] },
    { path: 'puntosdeventaadministrar', loadChildren: () => import('./modulos/punto-venta/punto-venta.module').then(m => m.PuntoVentaModule), canActivate: [GuardiaService] },
    { path: 'logisticavehiculospropios', loadChildren: () => import('./modulos/vehiculo/vehiculo.module').then(m => m.VehiculoModule), canActivate: [GuardiaService] },
    { path: 'logisticaproveedoresvehiculos', loadChildren: () => import('./modulos/vehiculo-proveedor/vehiculo-proveedor.module').then(m => m.VehiculoProveedorModule), canActivate: [GuardiaService] },
    { path: 'generalescompaniadeseguropolizas', loadChildren: () => import('./modulos/compania-seguro-poliza/compania-seguro-poliza.module').then(m => m.CompaniaSeguroPolizaModule), canActivate: [GuardiaService] },
    { path: 'reestablecertablastablarolsubopcion', loadChildren: () => import('./modulos/rol-subopcion/rol-subopcion.module').then(m => m.RolSubopcionModule), canActivate: [GuardiaService] },
    { path: 'reestablecertablastablarolopcion', loadChildren: () => import('./modulos/rol-opcion/rol-opcion.module').then(m => m.RolOpcionModule), canActivate: [GuardiaService] },
    { path: 'reestablecertablastablasubopcionpestania', loadChildren: () => import('./modulos/subopcion-pestania/subopcion-pestania.module').then(m => m.SubopcionPestaniaModule), canActivate: [GuardiaService] },
    { path: 'reestablecertablastablausuarioempresa', loadChildren: () => import('./modulos/usuario-empresa/usuario-empresa.module').then(m => m.UsuarioEmpresaModule), canActivate: [GuardiaService] },
    { path: 'organizacionempresas', loadChildren: () => import('./modulos/empresa/empresa.module').then(m => m.EmpresaModule), canActivate: [GuardiaService] },
    { path: 'guiasdeserviciosremitosgs', loadChildren: () => import('./modulos/viaje-remito/viaje-remito.module').then(m => m.ViajeRemitoModule), canActivate: [GuardiaService] },
    { path: 'guiasdeserviciosemisiongs', loadChildren: () => import('./modulos/viaje/viaje.module').then(m => m.ViajeModule), canActivate: [GuardiaService] },
    { path: 'webservicesafipsolicitarcaeanticipado', loadChildren: './modulos/cae-anticipado/cae-anticipado.module#CaeAnticipadoModule', canActivate: [GuardiaService] },
    { path: 'webservicesafipconsultarestadodelservicio', loadChildren: () => import('./modulos/estado-servicio-afip/estado-servicio-afip.module').then(m => m.EstadoServicioAfipModule), canActivate: [GuardiaService] },
    { path: 'facturacionfacturas', loadChildren: './modulos/emitir-factura/emitir-factura.module#EmitirFacturaModule', canActivate: [GuardiaService] },
    { path: 'facturacionnotasdecredito', loadChildren: './modulos/emitir-nota-credito/emitir-nota-credito.module#EmitirNotaCreditoModule', canActivate: [GuardiaService] },
    { path: 'facturacionnotasdedebito', loadChildren: './modulos/emitir-nota-debito/emitir-nota-debito.module#EmitirNotaDebitoModule', canActivate: [GuardiaService] },
    { path: 'contablemonedas', loadChildren: () => import('./modulos/moneda/moneda.module').then(m => m.MonedaModule), canActivate: [GuardiaService] },
    { path: 'contablemonedascotizacion', loadChildren: () => import('./modulos/moneda-cotizacion/moneda-cotizacion.module').then(m => m.MonedaCotizacionModule), canActivate: [GuardiaService] },
    { path: 'contablemonedascuentacontable', loadChildren: () => import('./modulos/moneda-cuenta-contable/moneda-cuenta-contable.module').then(m => m.MonedaCuentaContableModule), canActivate: [GuardiaService] },
    { path: 'webservicesafipconsultarpuntosdevtaautorizados', loadChildren: './modulos/punto-venta-autorizado/punto-venta-autorizado.module#PuntoVentaAutorizadoModule', canActivate: [GuardiaService] },
    { path: 'repartosplanillassalientes', loadChildren: './modulos/reparto-saliente/reparto-saliente.module#RepartoSalienteModule', canActivate: [GuardiaService] },
    { path: 'repartosplanillasentrantes', loadChildren: './modulos/reparto-entrante/reparto-entrante.module#RepartoEntranteModule', canActivate: [GuardiaService] },
    { path: 'usuariosusuariosempresas', loadChildren: './modulos/usuario-empresas/usuario-empresas.module#UsuarioEmpresasModule', canActivate: [GuardiaService] },
    { path: 'rolesadministrarmenu', loadChildren: './modulos/rol-subopcion-menu/rol-subopcion-menu.module#RolSubopcionMenuModule', canActivate: [GuardiaService] },
    { path: 'logisticainsumosproductos', loadChildren: () => import('./modulos/producto/producto.module').then(m => m.ProductoModule), canActivate: [GuardiaService] },
    { path: 'logisticadepositosinsumosproductos', loadChildren: () => import('./modulos/deposito-insumo-producto/deposito-insumo-producto.module').then(m => m.DepositoInsumoProductoModule), canActivate: [GuardiaService] },
    { path: 'menuopciones', loadChildren: './modulos/opcion/opcion.module#OpcionModule', canActivate: [GuardiaService] },
    { path: 'plandecuentasdefinicion', loadChildren: './modulos/plan-cuenta/plan-cuenta.module#PlanCuentaModule', canActivate: [GuardiaService] },
    { path: 'configuraciontiposdecomprobante', loadChildren: './modulos/tipo-comprobante/tipo-comprobante.module#TipoComprobanteModule', canActivate: [GuardiaService] },
    { path: 'configuraciontiposdecontacto', loadChildren: './modulos/tipo-contacto/tipo-contacto.module#TipoContactoModule', canActivate: [GuardiaService] },
    { path: 'configuraciontiposdedocumentos', loadChildren: './modulos/tipo-documento/tipo-documento.module#TipoDocumentoModule', canActivate: [GuardiaService] },
    { path: 'configuraciontiposdeproveedor', loadChildren: './modulos/tipo-proveedor/tipo-proveedor.module#TipoProveedorModule', canActivate: [GuardiaService] },
    { path: 'configuraciontiposdetarifa', loadChildren: './modulos/tipo-tarifa/tipo-tarifa.module#TipoTarifaModule', canActivate: [GuardiaService] },
    { path: 'configuracionafipconcepto', loadChildren: './modulos/concepto-afip/concepto-afip.module#ConceptoAfipModule', canActivate: [GuardiaService] },
    { path: 'configuracionventasconceptos', loadChildren: './modulos/venta-concepto/venta-concepto.module#VentaConceptoModule', canActivate: [GuardiaService] },
    { path: 'configuracionventatipoitem', loadChildren: './modulos/venta-tipo/venta-tipo.module#VentaTipoModule', canActivate: [GuardiaService] },
    { path: 'recoleccionesadministrar', loadChildren: './modulos/orden-recoleccion/orden-recoleccion.module#OrdenRecoleccionModule', canActivate: [GuardiaService] },
    { path: 'logisticaunidadesdenegocio', loadChildren: () => import('./modulos/viaje-unidad-negocio/viaje-unidad-negocio.module').then(m => m.ViajeUnidadNegocioModule), canActivate: [GuardiaService] },
    { path: 'contablecondicionesdeiva', loadChildren: './modulos/afip-condicion-iva/afip-condicion-iva.module#AfipCondicionIvaModule', canActivate: [GuardiaService] },
    { path: 'categoriasbasicos', loadChildren: './modulos/basico-categoria/basico-categoria.module#BasicoCategoriaModule', canActivate: [GuardiaService] },
    { path: 'soporte', loadChildren: './modulos/soporte/soporte.module#SoporteModule', canActivate: [GuardiaService] },
    { path: 'configuraciontiposdefamiliares', loadChildren: './modulos/tipo-familiar/tipo-familiar.module#TipoFamiliarModule', canActivate: [GuardiaService] },
    { path: 'legajosfamiliares', loadChildren: './modulos/personal-familiar/personal-familiar.module#PersonalFamiliarModule', canActivate: [GuardiaService] },
    { path: 'usuarioscontrasenas', loadChildren: './modulos/contrasenia/contrasenia.module#ContraseniaModule', canActivate: [GuardiaService] },
    { path: 'contablecostosinsumosproductos', loadChildren: () => import('./modulos/costos-insumos-producto/costos-insumos-producto.module').then(m => m.CostosInsumosProductoModule), canActivate: [GuardiaService] },
    { path: 'contablecostosdeviajesgs', loadChildren: () => import('./modulos/viaje-tipo/viaje-tipo.module').then(m => m.ViajeTipoModule), canActivate: [GuardiaService] },
    { path: 'legajosvencimientoschoferes', loadChildren: './modulos/vencimientos-choferes/vencimientos-choferes.module#VencimientosChoferesModule', canActivate: [GuardiaService] },
    { path: 'cuentasbancariascuentas', loadChildren: './modulos/cuenta-bancaria/cuenta-bancaria.module#CuentaBancariaModule', canActivate: [GuardiaService] },
    { path: 'sindicatostipochequera', loadChildren: './modulos/tipo-chequera/tipo-chequera.module#TipoChequeraModule', canActivate: [GuardiaService] },
    { path: 'cuentasbancariaschequeras', loadChildren: './modulos/chequera/chequera.module#ChequeraModule', canActivate: [GuardiaService] },
    { path: 'gestiondecobrostalonariosreciboscobradores', loadChildren: './modulos/talonario-recibo-cobrador/talonario-recibo-cobrador.module#TalonarioReciboCobradorModule', canActivate: [GuardiaService] },
    { path: 'gestiondecobrostalonariosreciboslote', loadChildren: './modulos/talonario-recibo-lote/talonario-recibo-lote.module#TalonarioReciboLoteModule', canActivate: [GuardiaService] },
    { path: 'bugimagen', loadChildren: './modulos/bug-imagen-dialogo/bug-imagen-dialogo.module#BugImagenDialogoModule', canActivate: [GuardiaService] },
    { path: 'impuestoalasgananciasdeduccionesgeneralesdescripcion', loadChildren: './modulos/deduccion-general/deduccion-general.module#DeduccionGeneralModule', canActivate: [GuardiaService] },
    { path: 'impuestoalasgananciasdeduccionesgeneralestopes', loadChildren: './modulos/deduccion-general-tope/deduccion-general-tope.module#DeduccionGeneralTopeModule', canActivate: [GuardiaService] },
    { path: 'impuestoalasgananciasdeduccionespersonalesdescripcion', loadChildren: './modulos/deduccion-personal/deduccion-personal.module#DeduccionPersonalModule', canActivate: [GuardiaService] },
    { path: 'impuestoalasgananciasganancianetaescala', loadChildren: './modulos/ganancia-neta/ganancia-neta.module#GananciaNetaModule', canActivate: [GuardiaService] },
    { path: 'impuestoalasgananciasdeduccionespersonalestablas', loadChildren: './modulos/deduccion-personal-tabla/deduccion-personal-tabla.module#DeduccionPersonalTablaModule', canActivate: [GuardiaService] },
    { path: 'comprobantesproveedoresfacturasdebitosycreditos', loadChildren: () => import('./modulos/factura-debito-credito/factura-debito-credito.module').then(m => m.FacturaDebitoCreditoModule), canActivate: [GuardiaService] },
    { path: 'configuraciontipodechequera', loadChildren: './modulos/tipo-chequera/tipo-chequera.module#TipoChequeraModule', canActivate: [GuardiaService] },
    { path: 'configuraciontiporetencion', loadChildren: './modulos/tipo-retencion/tipo-retencion.module#TipoRetencionModule', canActivate: [GuardiaService] },
    { path: 'configuraciontipopercepcion', loadChildren: './modulos/tipo-percepcion/tipo-percepcion.module#TipoPercepcionModule', canActivate: [GuardiaService] },
    { path: 'configuraciontipofamiliar', loadChildren: './modulos/tipo-familiar/tipo-familiar.module#TipoFamiliarModule', canActivate: [GuardiaService] },
    { path: 'adelantosadelantosenlote', loadChildren: './modulos/adelanto-lote/adelanto-lote.module#AdelantoLoteModule', canActivate: [GuardiaService] },
    { path: 'adelantosadministrar', loadChildren: './modulos/adelanto-personal/adelanto-personal.module#AdelantoPersonalModule', canActivate: [GuardiaService] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }