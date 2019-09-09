import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PestaniaRoutingModule } from './pestania-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PestaniaComponent } from 'src/app/componentes/pestania/pestania.component';

@NgModule({
  declarations: [
    PestaniaComponent,
  ],
  imports: [
    CommonModule,
    PestaniaRoutingModule,
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
export class PestaniaModule { }
