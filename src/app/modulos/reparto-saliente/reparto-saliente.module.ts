import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepartoSalienteRoutingModule } from './reparto-saliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepartoComponent } from 'src/app/componentes/reparto-saliente/reparto.component';
import { Reparto } from 'src/app/modelos/reparto';

@NgModule({
  declarations: [
    RepartoComponent,
  ],
  imports: [
    CommonModule,
    RepartoSalienteRoutingModule,
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
    Reparto
  ]
})
export class RepartoSalienteModule { }
