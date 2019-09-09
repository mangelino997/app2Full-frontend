import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VencimientosChoferesRoutingModule } from './vencimientos-choferes-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VencimientosChoferesComponent } from 'src/app/componentes/vencimientos-choferes/vencimientos-choferes.component';

@NgModule({
  declarations: [
    VencimientosChoferesComponent,
  ],
  imports: [
    CommonModule,
    VencimientosChoferesRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule
  ]
})
export class VencimientosChoferesModule { }
