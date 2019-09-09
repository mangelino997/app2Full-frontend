import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeduccionGeneralTopeRoutingModule } from './deduccion-general-tope-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeduccionGeneralTopeComponent } from 'src/app/componentes/deduccion-general-tope/deduccion-general-tope.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    DeduccionGeneralTopeComponent,
  ],
  imports: [
    CommonModule,
    DeduccionGeneralTopeRoutingModule,
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
export class DeduccionGeneralTopeModule { }
