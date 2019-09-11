import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanCuentaRoutingModule } from './plan-cuenta-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatTreeModule, MatIconModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlanCuentaComponent } from 'src/app/componentes/plan-cuenta/plan-cuenta.component';
import { PlanCuentaService } from 'src/app/servicios/plan-cuenta.service';
import { TipoCuentaContableService } from 'src/app/servicios/tipo-cuenta-contable.service';
import { GrupoCuentaContableService } from 'src/app/servicios/grupo-cuenta-contable.service';

@NgModule({
  declarations: [
    PlanCuentaComponent,
  ],
  imports: [
    CommonModule,
    PlanCuentaRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    PlanCuentaService,
    TipoCuentaContableService,
    GrupoCuentaContableService,
  ]
})
export class PlanCuentaModule { }
