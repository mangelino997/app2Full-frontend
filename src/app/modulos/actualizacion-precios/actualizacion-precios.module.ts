import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActualizacionPreciosRoutingModule } from './actualizacion-precios-routing.module';
import { ActualizacionPreciosComponent, ListaPreciosDialogo, ConfirmarDialogo } from 'src/app/componentes/actualizacion-precios/actualizacion-precios.component';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatCheckboxModule, MatButtonModule, MatDialogModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ActualizacionPrecios } from 'src/app/modelos/actualizacionPrecios';
import { ClienteService } from 'src/app/servicios/cliente.service';
import { OrdenVentaTramoService } from 'src/app/servicios/orden-venta-tramo.service';
import { OrdenVentaEscalaService } from 'src/app/servicios/orden-venta-escala.service';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { OrdenVentaService } from 'src/app/servicios/orden-venta.service';

@NgModule({
  declarations: [
    ActualizacionPreciosComponent,
    ListaPreciosDialogo,
    ConfirmarDialogo
  ],
  imports: [
    CommonModule,
    ActualizacionPreciosRoutingModule,
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
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    TextMaskModule,
    MatTooltipModule
  ],
  providers: [
    ActualizacionPrecios,
    ClienteService,
    OrdenVentaTramoService,
    OrdenVentaEscalaService,
    EmpresaService,
    OrdenVentaService
  ],
  entryComponents: [
    ListaPreciosDialogo,
    ConfirmarDialogo
  ]
})
export class ActualizacionPreciosModule { }
