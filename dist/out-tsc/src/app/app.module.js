"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var animations_1 = require("@angular/platform-browser/animations");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var ngx_toastr_1 = require("ngx-toastr");
var ng2_stompjs_1 = require("@stomp/ng2-stompjs");
//Servicios
var app_service_1 = require("./servicios/app.service");
var login_service_1 = require("./servicios/login.service");
var guardia_service_1 = require("./servicios/guardia.service");
var usuario_service_1 = require("./servicios/usuario.service");
var pais_service_1 = require("./servicios/pais.service");
var provincia_service_1 = require("./servicios/provincia.service");
var localidad_service_1 = require("./servicios/localidad.service");
var empresa_service_1 = require("./servicios/empresa.service");
var subopcion_pestania_service_1 = require("./servicios/subopcion-pestania.service");
var agenda_telefonica_service_1 = require("./servicios/agenda-telefonica.service");
var area_service_1 = require("./servicios/area.service");
var banco_service_1 = require("./servicios/banco.service");
var barrio_service_1 = require("./servicios/barrio.service");
var categoria_service_1 = require("./servicios/categoria.service");
var cobrador_service_1 = require("./servicios/cobrador.service");
var compania_seguro_service_1 = require("./servicios/compania-seguro.service");
var marca_producto_service_1 = require("./servicios/marca-producto.service");
var marca_vehiculo_service_1 = require("./servicios/marca-vehiculo.service");
var modulo_service_1 = require("./servicios/modulo.service");
var obra_social_service_1 = require("./servicios/obra-social.service");
var origen_destino_service_1 = require("./servicios/origen-destino.service");
var rol_service_1 = require("./servicios/rol.service");
var rubro_service_1 = require("./servicios/rubro.service");
var rubro_producto_service_1 = require("./servicios/rubro-producto.service");
var seguridad_social_service_1 = require("./servicios/seguridad-social.service");
var sexo_service_1 = require("./servicios/sexo.service");
var sindicato_service_1 = require("./servicios/sindicato.service");
var situacion_cliente_service_1 = require("./servicios/situacion-cliente.service");
var submodulo_service_1 = require("./servicios/submodulo.service");
var subopcion_service_1 = require("./servicios/subopcion.service");
var sucursal_service_1 = require("./servicios/sucursal.service");
var sucursal_banco_service_1 = require("./servicios/sucursal-banco.service");
var sucursal_cliente_service_1 = require("./servicios/sucursal-cliente.service");
var tipo_comprobante_service_1 = require("./servicios/tipo-comprobante.service");
var tipo_contacto_service_1 = require("./servicios/tipo-contacto.service");
var tipo_cuenta_bancaria_service_1 = require("./servicios/tipo-cuenta-bancaria.service");
var tipo_documento_service_1 = require("./servicios/tipo-documento.service");
var tipo_proveedor_service_1 = require("./servicios/tipo-proveedor.service");
var tipo_tarifa_service_1 = require("./servicios/tipo-tarifa.service");
var tipo_vehiculo_service_1 = require("./servicios/tipo-vehiculo.service");
var tramo_service_1 = require("./servicios/tramo.service");
var unidad_medida_service_1 = require("./servicios/unidad-medida.service");
var vendedor_service_1 = require("./servicios/vendedor.service");
var zona_service_1 = require("./servicios/zona.service");
var cliente_service_1 = require("./servicios/cliente.service");
var rol_opcion_service_1 = require("./servicios/rol-opcion.service");
var afip_condicion_iva_service_1 = require("./servicios/afip-condicion-iva.service");
var resumen_cliente_service_1 = require("./servicios/resumen-cliente.service");
var orden_venta_service_1 = require("./servicios/orden-venta.service");
var proveedor_service_1 = require("./servicios/proveedor.service");
var condicion_compra_service_1 = require("./servicios/condicion-compra.service");
var personal_service_1 = require("./servicios/personal.service");
var estado_civil_service_1 = require("./servicios/estado-civil.service");
var afip_actividad_service_1 = require("./servicios/afip-actividad.service");
var afip_comprobante_service_1 = require("./servicios/afip-comprobante.service");
var afip_condicion_service_1 = require("./servicios/afip-condicion.service");
var afip_localidad_service_1 = require("./servicios/afip-localidad.service");
var afip_mod_contratacion_service_1 = require("./servicios/afip-mod-contratacion.service");
var afip_siniestrado_service_1 = require("./servicios/afip-siniestrado.service");
var afip_situacion_service_1 = require("./servicios/afip-situacion.service");
var escala_tarifa_service_1 = require("./servicios/escala-tarifa.service");
var chofer_proveedor_service_1 = require("./servicios/chofer-proveedor.service");
var configuracion_vehiculo_service_1 = require("./servicios/configuracion-vehiculo.service");
var contacto_banco_service_1 = require("./servicios/contacto-banco.service");
var contacto_cliente_service_1 = require("./servicios/contacto-cliente.service");
var contacto_compania_seguro_service_1 = require("./servicios/contacto-compania-seguro.service");
var contacto_proveedor_service_1 = require("./servicios/contacto-proveedor.service");
var punto_venta_service_1 = require("./servicios/punto-venta.service");
var orden_venta_escala_service_1 = require("./servicios/orden-venta-escala.service");
var viaje_propio_service_1 = require("./servicios/viaje-propio.service");
var fecha_service_1 = require("./servicios/fecha.service");
var vehiculo_service_1 = require("./servicios/vehiculo.service");
var vehiculo_proveedor_service_1 = require("./servicios/vehiculo-proveedor.service");
var compania_seguro_poliza_service_1 = require("./servicios/compania-seguro-poliza.service");
var condicion_venta_service_1 = require("./servicios/condicion-venta.service");
var rol_subopcion_service_1 = require("./servicios/rol-subopcion.service");
var usuario_empresa_service_1 = require("./servicios/usuario-empresa.service");
var viaje_remito_service_1 = require("./servicios/viaje-remito.service");
var insumo_producto_service_1 = require("./servicios/insumo-producto.service");
var viaje_precio_service_1 = require("./servicios/viaje-precio.service");
var viaje_tarifa_service_1 = require("./servicios/viaje-tarifa.service");
var viaje_tipo_carga_service_1 = require("./servicios/viaje-tipo-carga.service");
var viaje_tipo_service_1 = require("./servicios/viaje-tipo.service");
var viaje_tramo_cliente_service_1 = require("./servicios/viaje-tramo-cliente.service");
var viaje_tramo_service_1 = require("./servicios/viaje-tramo.service");
var viaje_unidad_negocio_service_1 = require("./servicios/viaje-unidad-negocio.service");
var opcion_service_1 = require("./servicios/opcion.service");
var moneda_service_1 = require("./servicios/moneda.service");
var moneda_cotizacion_service_1 = require("./servicios/moneda-cotizacion.service");
var moneda_cuenta_contable_service_1 = require("./servicios/moneda-cuenta-contable.service");
var plan_cuenta_service_1 = require("./servicios/plan-cuenta.service");
var tipo_cuenta_contable_service_1 = require("./servicios/tipo-cuenta-contable.service");
var grupo_cuenta_contable_service_1 = require("./servicios/grupo-cuenta-contable.service");
var ejercicio_service_1 = require("./servicios/ejercicio.service");
var mes_service_1 = require("./servicios/mes.service");
var producto_service_1 = require("./servicios/producto.service");
var afip_concepto_service_1 = require("./servicios/afip-concepto.service");
var orden_venta_tramo_service_1 = require("./servicios/orden-venta-tramo.service");
var venta_tipo_item_service_1 = require("./servicios/venta-tipo-item.service");
var orden_recoleccion_service_1 = require("./servicios/orden-recoleccion.service");
//Modelos
var viajePropio_1 = require("./modelos/viajePropio");
var viajePropioTramo_1 = require("./modelos/viajePropioTramo");
var viajePropioTramoCliente_1 = require("./modelos/viajePropioTramoCliente");
var viajePropioCombustible_1 = require("./modelos/viajePropioCombustible");
var viajePropioEfectivo_1 = require("./modelos/viajePropioEfectivo");
var viajePropioInsumo_1 = require("./modelos/viajePropioInsumo");
var viajeRemito_1 = require("./modelos/viajeRemito");
var viajePropioGasto_1 = require("./modelos/viajePropioGasto");
var viajePropioPeaje_1 = require("./modelos/viajePropioPeaje");
var notaCredito_1 = require("./modelos/notaCredito");
var notaDebito_1 = require("./modelos/notaDebito");
var reparto_1 = require("./modelos/reparto");
var usuarioEmpresa_1 = require("./modelos/usuarioEmpresa");
var companiaSeguroPoliza_1 = require("./modelos/companiaSeguroPoliza");
var vehiculo_1 = require("./modelos/vehiculo");
var cliente_1 = require("./modelos/cliente");
var empresa_1 = require("./modelos/empresa");
var proveedor_1 = require("./modelos/proveedor");
var moneda_1 = require("./modelos/moneda");
var ordenVenta_1 = require("./modelos/ordenVenta");
var ordenVentaEscala_1 = require("./modelos/ordenVentaEscala");
var ordenVentaTramo_1 = require("./modelos/ordenVentaTramo");
var moneda_cotizacion_1 = require("./modelos/moneda-cotizacion");
var moneda_cuenta_contable_1 = require("./modelos/moneda-cuenta-contable");
var tipo_cuenta_bancaria_1 = require("./modelos/tipo-cuenta-bancaria");
var tipo_cuenta_contable_1 = require("./modelos/tipo-cuenta-contable");
var grupo_cuenta_contable_1 = require("./modelos/grupo-cuenta-contable");
var ejercicio_1 = require("./modelos/ejercicio");
var condicion_compra_1 = require("./modelos/condicion-compra");
var condicion_venta_1 = require("./modelos/condicion-venta");
var producto_1 = require("./modelos/producto");
var concepto_afip_1 = require("./modelos/concepto-afip");
var venta_concepto_1 = require("./modelos/venta-concepto");
var venta_tipo_item_1 = require("./modelos/venta-tipo-item");
var viajeUnidadNegocio_1 = require("./modelos/viajeUnidadNegocio");
var actualizacionPrecios_1 = require("./modelos/actualizacionPrecios");
var ordenRecoleccion_1 = require("./modelos/ordenRecoleccion");
//Componentes
var app_component_1 = require("./app.component");
var login_component_1 = require("./componentes/login/login.component");
var pais_component_1 = require("./componentes/pais/pais.component"); //Probado
var home_component_1 = require("./componentes/home/home.component");
var usuario_component_1 = require("./componentes/usuario/usuario.component");
var empresa_component_1 = require("./componentes/empresa/empresa.component");
var pestania_component_1 = require("./componentes/pestania/pestania.component");
var agenda_telefonica_component_1 = require("./componentes/agenda-telefonica/agenda-telefonica.component"); //Probado
var area_component_1 = require("./componentes/area/area.component");
var banco_component_1 = require("./componentes/banco/banco.component"); //Probado
var barrio_component_1 = require("./componentes/barrio/barrio.component"); //Probado
var categoria_component_1 = require("./componentes/categoria/categoria.component"); //Probado
var cobrador_component_1 = require("./componentes/cobrador/cobrador.component"); //Probado
var compania_seguro_component_1 = require("./componentes/compania-seguro/compania-seguro.component"); //Probado
var marca_producto_component_1 = require("./componentes/marca-producto/marca-producto.component"); //Probado
var marca_vehiculo_component_1 = require("./componentes/marca-vehiculo/marca-vehiculo.component"); //Probado
var modulo_component_1 = require("./componentes/modulo/modulo.component"); //Probado
var obra_social_component_1 = require("./componentes/obra-social/obra-social.component"); //Probado
var localidad_component_1 = require("./componentes/localidad/localidad.component"); //Probado
var origen_destino_component_1 = require("./componentes/origen-destino/origen-destino.component"); //Probado
var provincia_component_1 = require("./componentes/provincia/provincia.component"); //Probado
var rol_component_1 = require("./componentes/rol/rol.component"); //Probado
var rubro_component_1 = require("./componentes/rubro/rubro.component"); //Probado
var rubro_producto_component_1 = require("./componentes/rubro-producto/rubro-producto.component"); //Probado
var seguridad_social_component_1 = require("./componentes/seguridad-social/seguridad-social.component"); //Probado
var sexo_component_1 = require("./componentes/sexo/sexo.component");
var sindicato_component_1 = require("./componentes/sindicato/sindicato.component"); //Probado
var situacion_cliente_component_1 = require("./componentes/situacion-cliente/situacion-cliente.component");
var submodulo_component_1 = require("./componentes/submodulo/submodulo.component"); //Probado
var subopcion_component_1 = require("./componentes/subopcion/subopcion.component"); //Probado
var sucursal_component_1 = require("./componentes/sucursal/sucursal.component"); //Probado
var sucursal_banco_component_1 = require("./componentes/sucursal-banco/sucursal-banco.component"); //Probado
var tipo_comprobante_component_1 = require("./componentes/tipo-comprobante/tipo-comprobante.component");
var tipo_contacto_component_1 = require("./componentes/tipo-contacto/tipo-contacto.component");
var tipo_cuenta_bancaria_component_1 = require("./componentes/tipo-cuenta-bancaria/tipo-cuenta-bancaria.component");
var tipo_documento_component_1 = require("./componentes/tipo-documento/tipo-documento.component");
var tipo_proveedor_component_1 = require("./componentes/tipo-proveedor/tipo-proveedor.component");
var tipo_tarifa_component_1 = require("./componentes/tipo-tarifa/tipo-tarifa.component");
var tipo_vehiculo_component_1 = require("./componentes/tipo-vehiculo/tipo-vehiculo.component"); //Probado
var tramo_component_1 = require("./componentes/tramo/tramo.component"); //Probado
var unidad_medida_component_1 = require("./componentes/unidad-medida/unidad-medida.component");
var vendedor_component_1 = require("./componentes/vendedor/vendedor.component");
var zona_component_1 = require("./componentes/zona/zona.component"); //Probado
var cliente_component_1 = require("./componentes/cliente/cliente.component"); //Probado
var resumen_cliente_component_1 = require("./componentes/resumen-cliente/resumen-cliente.component");
var orden_venta_component_1 = require("./componentes/orden-venta/orden-venta.component");
var proveedor_component_1 = require("./componentes/proveedor/proveedor.component"); //Probado
var condicion_compra_component_1 = require("./componentes/condicion-compra/condicion-compra.component");
var personal_component_1 = require("./componentes/personal/personal.component"); //Probado
var estado_civil_component_1 = require("./componentes/estado-civil/estado-civil.component");
var escala_tarifa_component_1 = require("./componentes/escala-tarifa/escala-tarifa.component"); //Probado
var chofer_proveedor_component_1 = require("./componentes/chofer-proveedor/chofer-proveedor.component"); //Probado
var configuracion_vehiculo_component_1 = require("./componentes/configuracion-vehiculo/configuracion-vehiculo.component"); //Probado
var contacto_banco_component_1 = require("./componentes/contacto-banco/contacto-banco.component"); //Probado
var contacto_cliente_component_1 = require("./componentes/contacto-cliente/contacto-cliente.component"); //Revisar
var contacto_compania_seguro_component_1 = require("./componentes/contacto-compania-seguro/contacto-compania-seguro.component"); //Probado
var contacto_proveedor_component_1 = require("./componentes/contacto-proveedor/contacto-proveedor.component"); //Probado
var punto_venta_component_1 = require("./componentes/punto-venta/punto-venta.component"); //Probado
var sucursal_cliente_component_1 = require("./componentes/sucursal-cliente/sucursal-cliente.component"); //Probado
var vehiculo_component_1 = require("./componentes/vehiculo/vehiculo.component"); //Probado
var vehiculo_proveedor_component_1 = require("./componentes/vehiculo-proveedor/vehiculo-proveedor.component"); //Probado
var compania_seguro_poliza_component_1 = require("./componentes/compania-seguro-poliza/compania-seguro-poliza.component");
var viaje_remito_component_1 = require("./componentes/viaje-remito/viaje-remito.component");
var rol_subopcion_component_1 = require("./componentes/rol-subopcion/rol-subopcion.component"); //Probado
var subopcion_pestania_component_1 = require("./componentes/subopcion-pestania/subopcion-pestania.component"); //Probado
var usuario_empresa_component_1 = require("./componentes/usuario-empresa/usuario-empresa.component");
var viaje_component_1 = require("./componentes/viaje/viaje.component");
var actualizacion_precios_component_1 = require("./componentes/actualizacion-precios/actualizacion-precios.component");
var cae_anticipado_component_1 = require("./componentes/cae-anticipado/cae-anticipado.component");
var estado_servicio_afip_component_1 = require("./componentes/estado-servicio-afip/estado-servicio-afip.component");
var emitir_factura_component_1 = require("./componentes/emitir-factura/emitir-factura.component");
var emitir_nota_credito_component_1 = require("./componentes/emitir-nota-credito/emitir-nota-credito.component");
var emitir_nota_debito_component_1 = require("./componentes/emitir-nota-debito/emitir-nota-debito.component");
var moneda_component_1 = require("./componentes/moneda/moneda.component");
var moneda_cotizacion_component_1 = require("./componentes/moneda-cotizacion/moneda-cotizacion.component");
var moneda_cuenta_contable_component_1 = require("./componentes/moneda-cuenta-contable/moneda-cuenta-contable.component");
var puntos_venta_autorizado_component_1 = require("./componentes/puntos-venta-autorizado/puntos-venta-autorizado.component");
var reparto_component_1 = require("./componentes/reparto/reparto.component");
var condicion_venta_component_1 = require("./componentes/condicion-venta/condicion-venta.component");
var producto_component_1 = require("./componentes/producto/producto.component");
var usuario_empresas_component_1 = require("./componentes/usuario-empresas/usuario-empresas.component");
var rol_subopcion_menu_component_1 = require("./componentes/rol-subopcion-menu/rol-subopcion-menu.component");
var concepto_afip_component_1 = require("./componentes/concepto-afip/concepto-afip.component");
var reparto_entrante_component_1 = require("./componentes/reparto-entrante/reparto-entrante.component");
var venta_concepto_component_1 = require("./componentes/venta-concepto/venta-concepto.component");
var viaje_unidad_negocio_component_1 = require("./componentes/viaje-unidad-negocio/viaje-unidad-negocio.component");
var opcion_component_1 = require("./componentes/opcion/opcion.component");
var viaje_tramo_component_1 = require("./componentes/viaje/viaje-tramo/viaje-tramo.component");
var viaje_combustible_component_1 = require("./componentes/viaje/viaje-combustible/viaje-combustible.component");
var viaje_efectivo_component_1 = require("./componentes/viaje/viaje-efectivo/viaje-efectivo.component");
var viaje_insumo_component_1 = require("./componentes/viaje/viaje-insumo/viaje-insumo.component");
var viaje_gasto_component_1 = require("./componentes/viaje/viaje-gasto/viaje-gasto.component");
var viaje_peaje_component_1 = require("./componentes/viaje/viaje-peaje/viaje-peaje.component");
var viaje_remito_gs_component_1 = require("./componentes/viaje/viaje-remito-gs/viaje-remito-gs.component");
var plan_cuenta_component_1 = require("./componentes/plan-cuenta/plan-cuenta.component");
var tipo_cuenta_contable_component_1 = require("./componentes/tipo-cuenta-contable/tipo-cuenta-contable.component");
var grupo_cuenta_contable_component_1 = require("./componentes/grupo-cuenta-contable/grupo-cuenta-contable.component");
var ejercicio_component_1 = require("./componentes/ejercicio/ejercicio.component");
var venta_tipo_component_1 = require("./componentes/venta-tipo/venta-tipo.component");
var orden_recoleccion_component_1 = require("./componentes/orden-recoleccion/orden-recoleccion.component");
var cliente_eventual_component_1 = require("./componentes/cliente-eventual/cliente-eventual.component");
var clienteEventual_1 = require("./modelos/clienteEventual");
var emitirFactura_1 = require("./modelos/emitirFactura");
var viaje_propio_tramo_service_1 = require("./servicios/viaje-propio-tramo.service");
var viaje_tercero_tramo_service_1 = require("./servicios/viaje-tercero-tramo.service");
var venta_item_concepto_service_1 = require("./servicios/venta-item-concepto.service");
//Rutas
var appRoutes = [
    { path: '', component: login_component_1.LoginComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'home', component: home_component_1.HomeComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalespaises', component: pais_component_1.PaisComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalesagendatelefonica', component: agenda_telefonica_component_1.AgendaTelefonicaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'area', component: area_component_1.AreaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'contablebancos', component: banco_component_1.BancoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalesbarrios', component: barrio_component_1.BarrioComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'categoriasadministrar', component: categoria_component_1.CategoriaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalescobradores', component: cobrador_component_1.CobradorComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalescompaniadeseguro', component: compania_seguro_component_1.CompaniaSeguroComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generaleslocalidades', component: localidad_component_1.LocalidadComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'logisticamarcasproductos', component: marca_producto_component_1.MarcaProductoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'logisticamarcasvehiculos', component: marca_vehiculo_component_1.MarcaVehiculoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'menumodulos', component: modulo_component_1.ModuloComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'obrassocialesadministrar', component: obra_social_component_1.ObraSocialComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'origenesdestinosadministrar', component: origen_destino_component_1.OrigenDestinoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalesprovincias', component: provincia_component_1.ProvinciaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'rolesadministrar', component: rol_component_1.RolComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalesrubros', component: rubro_component_1.RubroComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'logisticarubrosproductos', component: rubro_producto_component_1.RubroProductoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'orgprevisionalesadministrar', component: seguridad_social_component_1.SeguridadSocialComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'sexo', component: sexo_component_1.SexoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'sindicatosadministrar', component: sindicato_component_1.SindicatoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'situacioncliente', component: situacion_cliente_component_1.SituacionClienteComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'menusubmodulos', component: submodulo_component_1.SubmoduloComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'menusubopciones', component: subopcion_component_1.SubopcionComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'organizacionsucursales', component: sucursal_component_1.SucursalComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'contablebancossucursales', component: sucursal_banco_component_1.SucursalBancoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalesclientessucursales', component: sucursal_cliente_component_1.SucursalClienteComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'tipocomprobante', component: tipo_comprobante_component_1.TipoComprobanteComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'tipocontacto', component: tipo_contacto_component_1.TipoContactoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'configuraciontiposdecuentabancaria', component: tipo_cuenta_bancaria_component_1.TipoCuentaBancariaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'configuraciontipodecuentacontable', component: tipo_cuenta_contable_component_1.TipoCuentaContableComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'configuraciongruposdecuentacontable', component: grupo_cuenta_contable_component_1.GrupoCuentaContableComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'ejerciciosadministrar', component: ejercicio_component_1.EjercicioComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'tipodocumento', component: tipo_documento_component_1.TipoDocumentoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'tipoproveedor', component: tipo_proveedor_component_1.TipoProveedorComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'tipotarifa', component: tipo_proveedor_component_1.TipoProveedorComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'logisticatiposdevehiculos', component: tipo_vehiculo_component_1.TipoVehiculoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'origenesdestinostramos', component: tramo_component_1.TramoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'unidadmedida', component: unidad_medida_component_1.UnidadMedidaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'usuariosadministrar', component: usuario_component_1.UsuarioComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'vendedor', component: vendedor_component_1.VendedorComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generaleszonas', component: zona_component_1.ZonaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalesclientes', component: cliente_component_1.ClienteComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'listasdepreciosordenesdeventa', component: orden_venta_component_1.OrdenVentaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalesproveedores', component: proveedor_component_1.ProveedorComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'contablecondicionesdecompra', component: condicion_compra_component_1.CondicionCompraComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'contablecondicionesdeventa', component: condicion_venta_component_1.CondicionVentaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'legajosadministraractivos', component: personal_component_1.PersonalComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'listasdepreciosescaladetarifas', component: escala_tarifa_component_1.EscalaTarifaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'logisticaproveedoreschoferes', component: chofer_proveedor_component_1.ChoferProveedorComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'logisticavehiculospropiosconfiguracion', component: configuracion_vehiculo_component_1.ConfiguracionVehiculoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'contablebancoscontactos', component: contacto_banco_component_1.ContactoBancoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalesclientescontactos', component: contacto_cliente_component_1.ContactoClienteComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalescompaniadesegurocontactos', component: contacto_compania_seguro_component_1.ContactoCompaniaSeguroComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalesproveedorescontactos', component: contacto_proveedor_component_1.ContactoProveedorComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'puntosdeventaadministrar', component: punto_venta_component_1.PuntoVentaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'logisticavehiculospropios', component: vehiculo_component_1.VehiculoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'logisticaproveedoresvehiculos', component: vehiculo_proveedor_component_1.VehiculoProveedorComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'generalescompaniadeseguropolizas', component: compania_seguro_poliza_component_1.CompaniaSeguroPolizaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'reestablecertablastablarolsubopcion', component: rol_subopcion_component_1.RolSubopcionComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'reestablecertablastablasubopcionpestania', component: subopcion_pestania_component_1.SubopcionPestaniaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'reestablecertablastablausuarioempresa', component: usuario_empresa_component_1.UsuarioEmpresaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'organizacionempresas', component: empresa_component_1.EmpresaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'guiasdeserviciosremitosgs', component: viaje_remito_component_1.ViajeRemitoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'guiasdeserviciosemisiongs', component: viaje_component_1.ViajeComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'listasdepreciosactualizaciondeprecios', component: actualizacion_precios_component_1.ActualizacionPreciosComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'webservicesafipsolicitarcaeanticipado', component: cae_anticipado_component_1.CaeAnticipadoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'webservicesafipconsultarestadodelservicio', component: estado_servicio_afip_component_1.EstadoServicioAfipComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'facturacionfacturas', component: emitir_factura_component_1.EmitirFacturaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'facturacionnotasdecredito', component: emitir_nota_credito_component_1.EmitirNotaCreditoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'facturacionnotasdedebito', component: emitir_nota_debito_component_1.EmitirNotaDebitoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'contablemonedas', component: moneda_component_1.MonedaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'contablemonedascotizacion', component: moneda_cotizacion_component_1.MonedaCotizacionComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'contablemonedasplandecuentas', component: moneda_cuenta_contable_component_1.MonedaCuentaContableComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'webservicesafipconsultarpuntosdevtaautorizados', component: puntos_venta_autorizado_component_1.PuntosVentaAutorizadoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'repartosplanillassalientes', component: reparto_component_1.RepartoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'repartosplanillasentrantes', component: reparto_entrante_component_1.RepartoEntranteComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'usuariosusuariosempresas', component: usuario_empresas_component_1.UsuarioEmpresasComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'rolesadministrarmenu', component: rol_subopcion_menu_component_1.RolSubopcionMenuComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'logisticaproductos', component: producto_component_1.ProductoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'menuopciones', component: reparto_entrante_component_1.RepartoEntranteComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'contablemonedacotizacion', component: moneda_cotizacion_component_1.MonedaCotizacionComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'contablemonedacuentacontable', component: moneda_cuenta_contable_component_1.MonedaCuentaContableComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'plandecuentasdefinicion', component: plan_cuenta_component_1.PlanCuentaComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'configuracionafipconcepto', component: concepto_afip_component_1.ConceptoAfipComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'configuracionventasconceptos', component: venta_concepto_component_1.VentaConceptoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'configuracionventatipoitem', component: venta_tipo_component_1.VentaTipoComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'configuracionviajeunidadnegocio', component: viaje_unidad_negocio_component_1.ViajeUnidadNegocioComponent, canActivate: [guardia_service_1.GuardiaService] },
    { path: 'recoleccionesadministrar', component: orden_recoleccion_component_1.OrdenRecoleccionComponent, canActivate: [guardia_service_1.GuardiaService] }
];
var stompConfig = {
    url: 'ws://192.168.0.156:8080/jitws/socket',
    headers: {},
    heartbeat_in: 0,
    heartbeat_out: 20000,
    reconnect_delay: 5000,
    debug: true
};
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                pais_component_1.PaisComponent,
                login_component_1.LoginComponent,
                home_component_1.HomeComponent,
                usuario_component_1.UsuarioComponent,
                empresa_component_1.EmpresaComponent,
                pestania_component_1.PestaniaComponent,
                agenda_telefonica_component_1.AgendaTelefonicaComponent,
                area_component_1.AreaComponent,
                banco_component_1.BancoComponent,
                barrio_component_1.BarrioComponent,
                categoria_component_1.CategoriaComponent,
                cobrador_component_1.CobradorComponent,
                compania_seguro_component_1.CompaniaSeguroComponent,
                marca_producto_component_1.MarcaProductoComponent,
                marca_vehiculo_component_1.MarcaVehiculoComponent,
                modulo_component_1.ModuloComponent,
                obra_social_component_1.ObraSocialComponent,
                localidad_component_1.LocalidadComponent,
                origen_destino_component_1.OrigenDestinoComponent,
                provincia_component_1.ProvinciaComponent,
                rol_component_1.RolComponent,
                rubro_component_1.RubroComponent,
                rubro_producto_component_1.RubroProductoComponent,
                seguridad_social_component_1.SeguridadSocialComponent,
                sexo_component_1.SexoComponent,
                sindicato_component_1.SindicatoComponent,
                situacion_cliente_component_1.SituacionClienteComponent,
                submodulo_component_1.SubmoduloComponent,
                subopcion_component_1.SubopcionComponent,
                sucursal_component_1.SucursalComponent,
                sucursal_banco_component_1.SucursalBancoComponent,
                tipo_comprobante_component_1.TipoComprobanteComponent,
                tipo_contacto_component_1.TipoContactoComponent,
                tipo_cuenta_bancaria_component_1.TipoCuentaBancariaComponent,
                tipo_documento_component_1.TipoDocumentoComponent,
                tipo_proveedor_component_1.TipoProveedorComponent,
                tipo_tarifa_component_1.TipoTarifaComponent,
                tipo_vehiculo_component_1.TipoVehiculoComponent,
                tramo_component_1.TramoComponent,
                unidad_medida_component_1.UnidadMedidaComponent,
                vendedor_component_1.VendedorComponent,
                zona_component_1.ZonaComponent,
                cliente_component_1.ClienteComponent,
                resumen_cliente_component_1.ResumenClienteComponent,
                orden_venta_component_1.OrdenVentaComponent,
                proveedor_component_1.ProveedorComponent,
                condicion_compra_component_1.CondicionCompraComponent,
                personal_component_1.PersonalComponent,
                estado_civil_component_1.EstadoCivilComponent,
                escala_tarifa_component_1.EscalaTarifaComponent,
                chofer_proveedor_component_1.ChoferProveedorComponent,
                configuracion_vehiculo_component_1.ConfiguracionVehiculoComponent,
                contacto_banco_component_1.ContactoBancoComponent,
                contacto_cliente_component_1.ContactoClienteComponent,
                contacto_compania_seguro_component_1.ContactoCompaniaSeguroComponent,
                contacto_proveedor_component_1.ContactoProveedorComponent,
                punto_venta_component_1.PuntoVentaComponent,
                sucursal_cliente_component_1.SucursalClienteComponent,
                vehiculo_component_1.VehiculoComponent,
                vehiculo_proveedor_component_1.VehiculoProveedorComponent,
                compania_seguro_poliza_component_1.CompaniaSeguroPolizaComponent,
                viaje_remito_component_1.ViajeRemitoComponent,
                rol_subopcion_component_1.RolSubopcionComponent,
                rol_subopcion_component_1.RolSubopcionDialog,
                subopcion_pestania_component_1.SubopcionPestaniaComponent,
                subopcion_pestania_component_1.SubopcionPestaniaDialog,
                usuario_empresa_component_1.UsuarioEmpresaComponent,
                usuario_empresa_component_1.UsuarioEmpresaDialog,
                viaje_component_1.ViajeComponent,
                actualizacion_precios_component_1.ActualizacionPreciosComponent,
                cae_anticipado_component_1.CaeAnticipadoComponent,
                estado_servicio_afip_component_1.EstadoServicioAfipComponent,
                emitir_factura_component_1.EmitirFacturaComponent,
                emitir_nota_credito_component_1.EmitirNotaCreditoComponent,
                emitir_nota_debito_component_1.EmitirNotaDebitoComponent,
                moneda_component_1.MonedaComponent,
                moneda_cotizacion_component_1.MonedaCotizacionComponent,
                moneda_cuenta_contable_component_1.MonedaCuentaContableComponent,
                puntos_venta_autorizado_component_1.PuntosVentaAutorizadoComponent,
                reparto_component_1.RepartoComponent,
                condicion_venta_component_1.CondicionVentaComponent,
                producto_component_1.ProductoComponent,
                usuario_empresas_component_1.UsuarioEmpresasComponent,
                rol_subopcion_menu_component_1.RolSubopcionMenuComponent,
                rol_subopcion_menu_component_1.UsuarioDialogo,
                rol_subopcion_menu_component_1.VistaPreviaDialogo,
                rol_subopcion_menu_component_1.PestaniaDialogo,
                concepto_afip_component_1.ConceptoAfipComponent,
                reparto_entrante_component_1.RepartoEntranteComponent,
                venta_concepto_component_1.VentaConceptoComponent,
                viaje_unidad_negocio_component_1.ViajeUnidadNegocioComponent,
                opcion_component_1.OpcionComponent,
                viaje_remito_component_1.ClienteEventualDialogo,
                viaje_tramo_component_1.DadorDestinatarioDialogo,
                viaje_tramo_component_1.DadorDestTablaDialogo,
                viaje_tramo_component_1.ObservacionesDialogo,
                viaje_tramo_component_1.ViajeTramoComponent,
                viaje_combustible_component_1.ViajeCombustibleComponent,
                viaje_efectivo_component_1.ViajeEfectivoComponent,
                viaje_insumo_component_1.ViajeInsumoComponent,
                viaje_gasto_component_1.ViajeGastoComponent,
                viaje_peaje_component_1.ViajePeajeComponent,
                viaje_remito_gs_component_1.ViajeRemitoGSComponent,
                empresa_component_1.ListaUsuariosDialogo,
                moneda_component_1.CambiarMonedaPrincipalDialogo,
                actualizacion_precios_component_1.ListaPreciosDialogo,
                actualizacion_precios_component_1.ConfimarDialogo,
                emitir_factura_component_1.ViajeDialogo,
                plan_cuenta_component_1.PlanCuentaComponent,
                tipo_cuenta_contable_component_1.TipoCuentaContableComponent,
                grupo_cuenta_contable_component_1.GrupoCuentaContableComponent,
                ejercicio_component_1.EjercicioComponent,
                venta_tipo_component_1.VentaTipoComponent,
                orden_recoleccion_component_1.OrdenRecoleccionComponent,
                cliente_eventual_component_1.ClienteEventualComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                animations_1.BrowserAnimationsModule,
                forms_1.FormsModule,
                material_1.MatButtonModule,
                material_1.MatCheckboxModule,
                material_1.MatMenuModule,
                material_1.MatToolbarModule,
                material_1.MatDividerModule,
                material_1.MatSelectModule,
                material_1.MatTabsModule,
                material_1.MatIconModule,
                material_1.MatCardModule,
                material_1.MatSidenavModule,
                material_1.MatInputModule,
                material_1.MatAutocompleteModule,
                material_1.MatRadioModule,
                material_1.MatTableModule,
                material_1.MatDialogModule,
                material_1.MatProgressBarModule,
                material_1.MatStepperModule,
                material_1.MatTreeModule,
                forms_1.ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
                ngx_toastr_1.ToastrModule.forRoot({
                    timeOut: 4000,
                    positionClass: 'toast-bottom-right',
                    preventDuplicates: true,
                }),
                router_1.RouterModule.forRoot(appRoutes)
            ],
            exports: [
                material_1.MatAutocompleteModule,
                material_1.MatButtonModule,
                material_1.MatCardModule,
                material_1.MatCheckboxModule,
                material_1.MatTableModule,
                material_1.MatIconModule,
                material_1.MatInputModule,
                material_1.MatMenuModule,
                material_1.MatRadioModule,
                material_1.MatSelectModule,
                material_1.MatSidenavModule,
                material_1.MatTabsModule,
                material_1.MatToolbarModule,
                forms_1.ReactiveFormsModule
            ],
            providers: [
                app_service_1.AppService,
                login_service_1.LoginService,
                guardia_service_1.GuardiaService,
                usuario_service_1.UsuarioService,
                pais_service_1.PaisService,
                provincia_service_1.ProvinciaService,
                localidad_service_1.LocalidadService,
                empresa_service_1.EmpresaService,
                empresa_1.Empresa,
                subopcion_pestania_service_1.SubopcionPestaniaService,
                agenda_telefonica_service_1.AgendaTelefonicaService,
                area_service_1.AreaService,
                banco_service_1.BancoService,
                barrio_service_1.BarrioService,
                categoria_service_1.CategoriaService,
                cobrador_service_1.CobradorService,
                compania_seguro_service_1.CompaniaSeguroService,
                marca_producto_service_1.MarcaProductoService,
                marca_vehiculo_service_1.MarcaVehiculoService,
                modulo_service_1.ModuloService,
                obra_social_service_1.ObraSocialService,
                origen_destino_service_1.OrigenDestinoService,
                rol_service_1.RolService,
                rubro_service_1.RubroService,
                rubro_producto_service_1.RubroProductoService,
                seguridad_social_service_1.SeguridadSocialService,
                sexo_service_1.SexoService,
                sindicato_service_1.SindicatoService,
                situacion_cliente_service_1.SituacionClienteService,
                submodulo_service_1.SubmoduloService,
                subopcion_service_1.SubopcionService,
                sucursal_service_1.SucursalService,
                sucursal_banco_service_1.SucursalBancoService,
                sucursal_cliente_service_1.SucursalClienteService,
                tipo_comprobante_service_1.TipoComprobanteService,
                tipo_contacto_service_1.TipoContactoService,
                tipo_cuenta_bancaria_service_1.TipoCuentaBancariaService,
                tipo_documento_service_1.TipoDocumentoService,
                tipo_proveedor_service_1.TipoProveedorService,
                tipo_tarifa_service_1.TipoTarifaService,
                tipo_vehiculo_service_1.TipoVehiculoService,
                tramo_service_1.TramoService,
                unidad_medida_service_1.UnidadMedidaService,
                vendedor_service_1.VendedorService,
                zona_service_1.ZonaService,
                cliente_service_1.ClienteService,
                cliente_1.Cliente,
                rol_opcion_service_1.RolOpcionService,
                afip_condicion_iva_service_1.AfipCondicionIvaService,
                resumen_cliente_service_1.ResumenClienteService,
                orden_venta_service_1.OrdenVentaService,
                proveedor_service_1.ProveedorService,
                proveedor_1.Proveedor,
                condicion_compra_service_1.CondicionCompraService,
                personal_service_1.PersonalService,
                estado_civil_service_1.EstadoCivilService,
                afip_actividad_service_1.AfipActividadService,
                afip_comprobante_service_1.AfipComprobanteService,
                afip_condicion_service_1.AfipCondicionService,
                afip_localidad_service_1.AfipLocalidadService,
                afip_mod_contratacion_service_1.AfipModContratacionService,
                afip_siniestrado_service_1.AfipSiniestradoService,
                afip_situacion_service_1.AfipSituacionService,
                escala_tarifa_service_1.EscalaTarifaService,
                chofer_proveedor_service_1.ChoferProveedorService,
                configuracion_vehiculo_service_1.ConfiguracionVehiculoService,
                contacto_banco_service_1.ContactoBancoService,
                contacto_cliente_service_1.ContactoClienteService,
                contacto_compania_seguro_service_1.ContactoCompaniaSeguroService,
                contacto_proveedor_service_1.ContactoProveedorService,
                punto_venta_service_1.PuntoVentaService,
                orden_venta_escala_service_1.OrdenVentaEscalaService,
                orden_venta_tramo_service_1.OrdenVentaTramoService,
                viaje_propio_service_1.ViajePropioService,
                fecha_service_1.FechaService,
                vehiculo_service_1.VehiculoService,
                vehiculo_1.Vehiculo,
                vehiculo_proveedor_service_1.VehiculoProveedorService,
                compania_seguro_poliza_service_1.CompaniaSeguroPolizaService,
                companiaSeguroPoliza_1.CompaniaSeguroPoliza,
                condicion_venta_service_1.CondicionVentaService,
                rol_subopcion_service_1.RolSubopcionService,
                usuario_empresa_service_1.UsuarioEmpresaService,
                viaje_remito_service_1.ViajeRemitoService,
                insumo_producto_service_1.InsumoProductoService,
                viaje_precio_service_1.ViajePrecioService,
                viaje_tarifa_service_1.ViajeTarifaService,
                viaje_tipo_carga_service_1.ViajeTipoCargaService,
                viaje_tipo_service_1.ViajeTipoService,
                viaje_tramo_cliente_service_1.ViajeTramoClienteService,
                viaje_tramo_service_1.ViajeTramoService,
                viaje_unidad_negocio_service_1.ViajeUnidadNegocioService,
                moneda_cotizacion_service_1.MonedaCotizacionService,
                viajePropio_1.ViajePropio,
                viajePropioTramo_1.ViajePropioTramo,
                viajePropioTramoCliente_1.ViajePropioTramoCliente,
                viajePropioCombustible_1.ViajePropioCombustible,
                viajePropioEfectivo_1.ViajePropioEfectivo,
                viajePropioInsumo_1.ViajePropioInsumo,
                viajeRemito_1.ViajeRemito,
                notaCredito_1.NotaCredito,
                notaDebito_1.NotaDebito,
                viajePropioGasto_1.ViajePropioGasto,
                viajePropioPeaje_1.ViajePropioPeaje,
                reparto_1.Reparto,
                usuarioEmpresa_1.UsuarioEmpresa,
                opcion_service_1.OpcionService,
                moneda_service_1.MonedaService,
                moneda_cuenta_contable_service_1.MonedaCuentaContableService,
                moneda_1.Moneda,
                moneda_cotizacion_1.MonedaCotizacion,
                moneda_cuenta_contable_1.MonedaCuentaContable,
                plan_cuenta_service_1.PlanCuentaService,
                ordenVenta_1.OrdenVenta,
                ordenVentaEscala_1.OrdenVentaEscala,
                ordenVentaTramo_1.OrdenVentaTramo,
                tipo_cuenta_bancaria_1.TipoCuentaBancaria,
                tipo_cuenta_contable_1.TipoCuentaContable,
                tipo_cuenta_contable_service_1.TipoCuentaContableService,
                grupo_cuenta_contable_1.GrupoCuentaContable,
                grupo_cuenta_contable_service_1.GrupoCuentaContableService,
                ejercicio_1.Ejercicio,
                ejercicio_service_1.EjercicioService,
                ng2_stompjs_1.StompService,
                condicion_compra_1.CondicionCompra,
                condicion_venta_1.CondicionVenta,
                producto_1.Producto,
                producto_service_1.ProductoService,
                concepto_afip_1.ConceptoAfip,
                afip_concepto_service_1.AfipConceptoService,
                venta_concepto_1.VentaConcepto,
                venta_tipo_item_1.VentaTipoItem,
                venta_tipo_item_service_1.VentaTipoItemService,
                viajeUnidadNegocio_1.ViajeUnidadNegocio,
                actualizacionPrecios_1.ActualizacionPrecios,
                ordenRecoleccion_1.OrdenRecoleccion,
                orden_recoleccion_service_1.OrdenRecoleccionService,
                clienteEventual_1.ClienteEventual,
                emitirFactura_1.EmitirFactura,
                viaje_propio_tramo_service_1.ViajePropioTramoService,
                viaje_tercero_tramo_service_1.ViajeTerceroTramoService,
                venta_item_concepto_service_1.VentaItemConceptoService,
                mes_service_1.MesService,
                {
                    provide: ng2_stompjs_1.StompConfig,
                    useValue: stompConfig
                }
            ],
            bootstrap: [app_component_1.AppComponent],
            entryComponents: [
                rol_subopcion_component_1.RolSubopcionDialog,
                subopcion_pestania_component_1.SubopcionPestaniaDialog,
                usuario_empresa_component_1.UsuarioEmpresaDialog,
                rol_subopcion_menu_component_1.UsuarioDialogo,
                rol_subopcion_menu_component_1.VistaPreviaDialogo,
                rol_subopcion_menu_component_1.PestaniaDialogo,
                viaje_remito_component_1.ClienteEventualDialogo,
                viaje_tramo_component_1.DadorDestinatarioDialogo,
                viaje_tramo_component_1.DadorDestTablaDialogo,
                viaje_tramo_component_1.ObservacionesDialogo,
                empresa_component_1.ListaUsuariosDialogo,
                moneda_component_1.CambiarMonedaPrincipalDialogo,
                actualizacion_precios_component_1.ListaPreciosDialogo,
                actualizacion_precios_component_1.ConfimarDialogo,
                emitir_factura_component_1.ViajeDialogo,
                cliente_eventual_component_1.ClienteEventualComponent
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map