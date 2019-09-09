import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeduccionPersonalTablaRoutingModule } from './deduccion-personal-tabla-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeduccionPersonalTablaComponent } from 'src/app/componentes/deduccion-personal-tabla/deduccion-personal-tabla.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    DeduccionPersonalTablaComponent,
  ],
  imports: [
    CommonModule,
    DeduccionPersonalTablaRoutingModule,
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
export class DeduccionPersonalTablaModule { }
