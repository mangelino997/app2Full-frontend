import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepartoEntranteRoutingModule } from './reparto-entrante-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepartoEntranteComponent } from 'src/app/componentes/reparto-entrante/reparto-entrante.component';
import { RepartoEntrante } from 'src/app/modelos/repartoEntrante';

@NgModule({
  declarations: [
    RepartoEntranteComponent,
  ],
  imports: [
    CommonModule,
    RepartoEntranteRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  providers: [
    RepartoEntrante
  ]
})
export class RepartoEntranteModule { }
