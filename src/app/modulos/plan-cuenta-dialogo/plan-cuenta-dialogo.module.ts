import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanCuentaDialogoRoutingModule } from './plan-cuenta-dialogo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatTreeModule, MatIconModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PlanCuentaDialogoRoutingModule,
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
    MatDialogModule
  ]
})
export class PlanCuentaDialogoModule { }
