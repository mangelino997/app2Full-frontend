import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GananciaNetaRoutingModule } from './ganancia-neta-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GananciaNetaComponent } from 'src/app/componentes/ganancia-neta/ganancia-neta.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    GananciaNetaComponent,
  ],
  imports: [
    CommonModule,
    GananciaNetaRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    TextMaskModule
  ]
})
export class GananciaNetaModule { }
