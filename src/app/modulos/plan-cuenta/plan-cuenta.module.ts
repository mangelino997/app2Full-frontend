import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanCuentaRoutingModule } from './plan-cuenta-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatTreeModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlanCuentaComponent } from 'src/app/componentes/plan-cuenta/plan-cuenta.component';
import { PlanCuentaService } from 'src/app/servicios/plan-cuenta.service';

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
    MatIconModule
  ],
  providers: [
    PlanCuentaService
  ]
})
export class PlanCuentaModule { }
