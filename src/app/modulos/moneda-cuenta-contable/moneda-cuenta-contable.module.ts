import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonedaCuentaContableRoutingModule } from './moneda-cuenta-contable-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatTreeModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonedaCuentaContableComponent } from 'src/app/componentes/moneda-cuenta-contable/moneda-cuenta-contable.component';
import { MonedaCuentaContableService } from 'src/app/servicios/moneda-cuenta-contable.service';
import { MonedaCuentaContable } from 'src/app/modelos/moneda-cuenta-contable';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { PlanCuentaDialogo } from 'src/app/componentes/plan-cuenta-dialogo/plan-cuenta-dialogo.component';

@NgModule({
  declarations: [
    MonedaCuentaContableComponent,
    PlanCuentaDialogo
  ],
  imports: [
    CommonModule,
    MonedaCuentaContableRoutingModule,
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
    MatTreeModule,
    MatIconModule
  ],
  providers: [
    MonedaCuentaContableService,
    MonedaCuentaContable,
    SubopcionPestaniaService,
    MonedaService
  ],
  entryComponents: [
    PlanCuentaDialogo
  ]
})
export class MonedaCuentaContableModule { }
