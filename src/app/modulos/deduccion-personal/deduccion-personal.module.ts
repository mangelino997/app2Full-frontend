import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeduccionPersonalRoutingModule } from './deduccion-personal-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeduccionPersonalComponent } from 'src/app/componentes/deduccion-personal/deduccion-personal.component';

@NgModule({
  declarations: [
    DeduccionPersonalComponent,
  ],
  imports: [
    CommonModule,
    DeduccionPersonalRoutingModule,
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
export class DeduccionPersonalModule { }
