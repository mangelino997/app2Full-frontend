import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViajeComponent } from 'src/app/componentes/viaje/viaje.component';
import { ViajeTramoComponent } from 'src/app/componentes/viaje/viaje-tramo/viaje-tramo.component';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatProgressSpinnerModule, MatCardModule, MatStepperModule, MatIconModule, MatCheckboxModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { CommonModule } from '@angular/common';
import { ViajeCombustibleComponent } from 'src/app/componentes/viaje/viaje-combustible/viaje-combustible.component';
import { ViajeEfectivoComponent } from 'src/app/componentes/viaje/viaje-efectivo/viaje-efectivo.component';
import { ViajeInsumoComponent } from 'src/app/componentes/viaje/viaje-insumo/viaje-insumo.component';
import { ViajeRemitoGSComponent } from 'src/app/componentes/viaje/viaje-remito-gs/viaje-remito-gs.component';
import { ViajeGastoComponent } from 'src/app/componentes/viaje/viaje-gasto/viaje-gasto.component';
import { ViajePeajeComponent } from 'src/app/componentes/viaje/viaje-peaje/viaje-peaje.component';
import { ViajeService } from 'src/app/servicios/viaje.service';
import { ViajeTramoService } from 'src/app/servicios/viaje-tramo.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { VehiculoService } from 'src/app/servicios/vehiculo.service';
import { VehiculoProveedorService } from 'src/app/servicios/vehiculo-proveedor.service';
import { PersonalService } from 'src/app/servicios/personal.service';
import { Viaje } from 'src/app/modelos/viaje';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';
import { ViajeTramo } from 'src/app/modelos/viajeTramo';
import { ViajeCombustible } from 'src/app/modelos/viajeCombustible';
import { ViajeEfectivo } from 'src/app/modelos/viajeEfectivo';
import { ViajeInsumo } from 'src/app/modelos/viajeInsumo';
import { ViajePeaje } from 'src/app/modelos/viajePeaje';
import { ViajeGasto } from 'src/app/modelos/viajeGasto';
import { TramoService } from 'src/app/servicios/tramo.service';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { ViajeUnidadNegocioService } from 'src/app/servicios/viaje-unidad-negocio.service';
import { InsumoProductoService } from 'src/app/servicios/insumo-producto.service';
import { ViajeCombustibleService } from 'src/app/servicios/viaje-combustible';
import { ViajeEfectivoService } from 'src/app/servicios/viaje-efectivo';
import { ViajeInsumoService } from 'src/app/servicios/viaje-insumo';
import { ViajeGastoService } from 'src/app/servicios/viaje-gasto';
import { ViajePeajeService } from 'src/app/servicios/viaje-peaje';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';
import { ViajeRemitoService } from 'src/app/servicios/viaje-remito.service';
import { ViajeTipoCargaService } from 'src/app/servicios/viaje-tipo-carga.service';
import { ViajeTipoService } from 'src/app/servicios/viaje-tipo.service';
import { ViajeTarifaService } from 'src/app/servicios/viaje-tarifa.service';
import { ProveedorService } from 'src/app/servicios/proveedor.service';
import { ViajeRemito } from 'src/app/modelos/viajeRemito';

const routes: Routes = [
  {path: '', component: ViajeComponent}
];

@NgModule({
  declarations: [
    ViajeComponent,
    ViajeTramoComponent,
    ViajeCombustibleComponent,
    ViajeEfectivoComponent,
    ViajeInsumoComponent,
    ViajeRemitoGSComponent,
    ViajeGastoComponent,
    ViajePeajeComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatStepperModule,
    TextMaskModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    ViajeService,
    ViajeTramoService,
    SubopcionPestaniaService,
    SucursalService,
    VehiculoService,
    VehiculoProveedorService,
    PersonalService,
    ChoferProveedorService,
    TramoService,
    EmpresaService,
    ViajeUnidadNegocioService,
    InsumoProductoService,
    RubroProductoService,
    ProveedorService,
    Viaje,
    ViajeTramo,
    ViajeCombustible,
    ViajeEfectivo,
    ViajeInsumo,
    ViajeGasto,
    ViajePeaje,
    ViajeRemito,
    ViajeCombustibleService,
    ViajeEfectivoService,
    ViajeInsumoService,
    ViajeGastoService,
    ViajePeajeService,
    ViajeRemitoService,
    ViajeTipoCargaService,
    ViajeTipoService,
    ViajeTarifaService
  ],
  exports: [RouterModule]
})
export class ViajeRoutingModule { }
