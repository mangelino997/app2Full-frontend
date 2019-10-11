import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanillaCerradaComponent } from 'src/app/componentes/planilla-cerrada/planilla-cerrada.component';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FechaService } from 'src/app/servicios/fecha.service';
import { RetiroDepositoService } from 'src/app/servicios/retiro-deposito.service';
import { ChoferProveedorService } from 'src/app/servicios/chofer-proveedor.service';
import { PlanillaCerradaRoutingModule } from './planilla-cerrada-routing-module';
import { RepartoDTO } from 'src/app/modelos/repartoDTO';
import { TextMaskModule } from 'angular2-text-mask';
@NgModule({
  declarations: [
    PlanillaCerradaModule
  ],
  imports: [
    CommonModule,
    PlanillaCerradaRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    TextMaskModule,
  ],
  providers: [
    RepartoDTO,
    FechaService,
    RetiroDepositoService,
    ChoferProveedorService
  ]
})
export class PlanillaCerradaModule { }
