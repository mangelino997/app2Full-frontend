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
    { path: 'webservicesafipsolicitarcaeanticipado', loadChildren: () => import('./modulos/cae-anticipado/cae-anticipado.module').then(m => m.CaeAnticipadoModule), canActivate: [GuardiaService] },
    { path: 'webservicesafipconsultarestadodelservicio', loadChildren: () => import('./modulos/estado-servicio-afip/estado-servicio-afip.module').then(m => m.EstadoServicioAfipModule), canActivate: [GuardiaService] },
    { path: 'facturacionfacturas', loadChildren: () => import('./modulos/emitir-factura/emitir-factura.module').then(m => m.EmitirFacturaModule), canActivate: [GuardiaService] },
    { path: 'facturacionnotasdecredito', loadChildren: () => import('./modulos/emitir-nota-credito/emitir-nota-credito.module').then(m => m.EmitirNotaCreditoModule), canActivate: [GuardiaService] },
    { path: 'facturacionnotasdedebito', loadChildren: () => import('./modulos/emitir-nota-debito/emitir-nota-debito.module').then(m => m.EmitirNotaDebitoModule), canActivate: [GuardiaService] },
    { path: 'contablemonedas', loadChildren: () => import('./modulos/moneda/moneda.module').then(m => m.MonedaModule), canActivate: [GuardiaService] },
    { path: 'contablemonedascotizacion', loadChildren: () => import('./modulos/moneda-cotizacion/moneda-cotizacion.module').then(m => m.MonedaCotizacionModule), canActivate: [GuardiaService] },
    { path: 'contablemonedascuentacontable', loadChildren: () => import('./modulos/moneda-cuenta-contable/moneda-cuenta-contable.module').then(m => m.MonedaCuentaContableModule), canActivate: [GuardiaService] },
    { path: 'webservicesafipconsultarpuntosdevtaautorizados', loadChildren: () => import('./modulos/punto-venta-autorizado/punto-venta-autorizado.module').then(m => m.PuntoVentaAutorizadoModule), canActivate: [GuardiaService] },
    { path: 'repartosplanillassalientes', loadChildren: () => import('./modulos/reparto-saliente/reparto-saliente.module').then(m => m.RepartoSalienteModule), canActivate: [GuardiaService] },
    { path: 'repartosplanillasentrantes', loadChildren: () => import('./modulos/reparto-entrante/reparto-entrante.module').then(m => m.RepartoEntranteModule), canActivate: [GuardiaService] },
    { path: 'usuariosusuariosempresas', loadChildren: () => import('./modulos/usuario-empresas/usuario-empresas.module').then(m => m.UsuarioEmpresasModule), canActivate: [GuardiaService] },
    { path: 'rolesadministrarmenu', loadChildren: () => import('./modulos/rol-subopcion-menu/rol-subopcion-menu.module').then(m => m.RolSubopcionMenuModule), canActivate: [GuardiaService] },
    { path: 'logisticainsumosproductos', loadChildren: () => import('./modulos/producto/producto.module').then(m => m.ProductoModule), canActivate: [GuardiaService] },
    { path: 'logisticadepositosinsumosproductos', loadChildren: () => import('./modulos/deposito-insumo-producto/deposito-insumo-producto.module').then(m => m.DepositoInsumoProductoModule), canActivate: [GuardiaService] },
    { path: 'menuopciones', loadChildren: () => import('./modulos/opcion/opcion.module').then(m => m.OpcionModule), canActivate: [GuardiaService] },
    { path: 'plandecuentasdefinicion', loadChildren: () => import('./modulos/plan-cuenta/plan-cuenta.module').then(m => m.PlanCuentaModule), canActivate: [GuardiaService] },
    { path: 'configuraciontiposdecomprobante', loadChildren: () => import('./modulos/tipo-comprobante/tipo-comprobante.module').then(m => m.TipoComprobanteModule), canActivate: [GuardiaService] },
    { path: 'configuraciontiposdecontacto', loadChildren: () => import('./modulos/tipo-contacto/tipo-contacto.module').then(m => m.TipoContactoModule), canActivate: [GuardiaService] },
    { path: 'configuraciontiposdedocumentos', loadChildren: () => import('./modulos/tipo-documento/tipo-documento.module').then(m => m.TipoDocumentoModule), canActivate: [GuardiaService] },
    { path: 'configuraciontiposdeproveedor', loadChildren: () => import('./modulos/tipo-proveedor/tipo-proveedor.module').then(m => m.TipoProveedorModule), canActivate: [GuardiaService] },
    { path: 'configuraciontiposdetarifa', loadChildren: () => import('./modulos/tipo-tarifa/tipo-tarifa.module').then(m => m.TipoTarifaModule), canActivate: [GuardiaService] },
    { path: 'configuracionafipconceptoventa', loadChildren: () => import('./modulos/concepto-afip/concepto-afip.module').then(m => m.ConceptoAfipModule), canActivate: [GuardiaService] },
    { path: 'configuracionventasconceptos', loadChildren: () => import('./modulos/venta-concepto/venta-concepto.module').then(m => m.VentaConceptoModule), canActivate: [GuardiaService] },
    { path: 'configuracionventatipoitem', loadChildren: () => import('./modulos/venta-tipo/venta-tipo.module').then(m => m.VentaTipoModule), canActivate: [GuardiaService] },
    { path: 'recoleccionesadministrar', loadChildren: () => import('./modulos/orden-recoleccion/orden-recoleccion.module').then(m => m.OrdenRecoleccionModule), canActivate: [GuardiaService] },
    { path: 'logisticaunidadesdenegocio', loadChildren: () => import('./modulos/viaje-unidad-negocio/viaje-unidad-negocio.module').then(m => m.ViajeUnidadNegocioModule), canActivate: [GuardiaService] },
    { path: 'contablecondicionesdeiva', loadChildren: () => import('./modulos/afip-condicion-iva/afip-condicion-iva.module').then(m => m.AfipCondicionIvaModule), canActivate: [GuardiaService] },
    { path: 'categoriasbasicos', loadChildren: () => import('./modulos/basico-categoria/basico-categoria.module').then(m => m.BasicoCategoriaModule), canActivate: [GuardiaService] },
    { path: 'soporte', loadChildren: () => import('./modulos/soporte/soporte.module').then(m => m.SoporteModule), canActivate: [GuardiaService] },
    { path: 'configuraciontiposdefamiliares', loadChildren: () => import('./modulos/tipo-familiar/tipo-familiar.module').then(m => m.TipoFamiliarModule), canActivate: [GuardiaService] },
    { path: 'legajosfamiliares', loadChildren: () => import('./modulos/personal-familiar/personal-familiar.module').then(m => m.PersonalFamiliarModule), canActivate: [GuardiaService] },
    { path: 'usuarioscontrasenas', loadChildren: () => import('./modulos/contrasenia/contrasenia.module').then(m => m.ContraseniaModule), canActivate: [GuardiaService] },
    { path: 'contablecostosinsumosproductos', loadChildren: () => import('./modulos/costos-insumos-producto/costos-insumos-producto.module').then(m => m.CostosInsumosProductoModule), canActivate: [GuardiaService] },
    { path: 'contablecostosdeviajesgs', loadChildren: () => import('./modulos/viaje-tipo/viaje-tipo.module').then(m => m.ViajeTipoModule), canActivate: [GuardiaService] },
    { path: 'legajosvencimientoschoferes', loadChildren: () => import('./modulos/vencimientos-choferes/vencimientos-choferes.module').then(m => m.VencimientosChoferesModule), canActivate: [GuardiaService] },
    { path: 'cuentasbancariascuentas', loadChildren: () => import('./modulos/cuenta-bancaria/cuenta-bancaria.module').then(m => m.CuentaBancariaModule), canActivate: [GuardiaService] },
    { path: 'cuentasbancariaschequeras', loadChildren: () => import('./modulos/chequera/chequera.module').then(m => m.ChequeraModule), canActivate: [GuardiaService] },
    { path: 'gestiondecobrostalonariosreciboscobradores', loadChildren: () => import('./modulos/talonario-recibo-cobrador/talonario-recibo-cobrador.module').then(m => m.TalonarioReciboCobradorModule), canActivate: [GuardiaService] },
    { path: 'gestiondecobrostalonariosreciboslote', loadChildren: () => import('./modulos/talonario-recibo-lote/talonario-recibo-lote.module').then(m => m.TalonarioReciboLoteModule), canActivate: [GuardiaService] },
    { path: 'impuestoalasgananciasdeduccionesgeneralesdescripcion', loadChildren: () => import('./modulos/deduccion-general/deduccion-general.module').then(m => m.DeduccionGeneralModule), canActivate: [GuardiaService] },
    { path: 'impuestoalasgananciasdeduccionesgeneralestopes', loadChildren: () => import('./modulos/deduccion-general-tope/deduccion-general-tope.module').then(m => m.DeduccionGeneralTopeModule), canActivate: [GuardiaService] },
    { path: 'impuestoalasgananciasdeduccionespersonalesdescripcion', loadChildren: () => import('./modulos/deduccion-personal/deduccion-personal.module').then(m => m.DeduccionPersonalModule), canActivate: [GuardiaService] },
    { path: 'impuestoalasgananciasganancianetaescala', loadChildren: () => import('./modulos/ganancia-neta/ganancia-neta.module').then(m => m.GananciaNetaModule), canActivate: [GuardiaService] },
    { path: 'impuestoalasgananciasdeduccionespersonalestablas', loadChildren: () => import('./modulos/deduccion-personal-tabla/deduccion-personal-tabla.module').then(m => m.DeduccionPersonalTablaModule), canActivate: [GuardiaService] },
    { path: 'comprobantesproveedoresfacturasdebitosycreditos', loadChildren: () => import('./modulos/factura-debito-credito/factura-debito-credito.module').then(m => m.FacturaDebitoCreditoModule), canActivate: [GuardiaService] },
    { path: 'configuraciontipodechequera', loadChildren: () => import('./modulos/tipo-chequera/tipo-chequera.module').then(m => m.TipoChequeraModule), canActivate: [GuardiaService] },
    { path: 'configuraciontiporetencion', loadChildren: () => import('./modulos/tipo-retencion/tipo-retencion.module').then(m => m.TipoRetencionModule), canActivate: [GuardiaService] },
    { path: 'configuraciontipopercepcion', loadChildren: () => import('./modulos/tipo-percepcion/tipo-percepcion.module').then(m => m.TipoPercepcionModule), canActivate: [GuardiaService] },
    { path: 'adelantosadelantosenlote', loadChildren: () => import('./modulos/adelanto-lote/adelanto-lote.module').then(m => m.AdelantoLoteModule), canActivate: [GuardiaService] },
    { path: 'adelantosadministrar', loadChildren: () => import('./modulos/adelanto-personal/adelanto-personal.module').then(m => m.AdelantoPersonalModule), canActivate: [GuardiaService] },
    { path: 'cierresdeviajesdocumentacion', loadChildren: () => import('./modulos/viaje-cierre-documentacion/viaje-cierre-documentacion.module').then(m => m.ViajeCierreDocumentacionModule), canActivate: [GuardiaService] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }