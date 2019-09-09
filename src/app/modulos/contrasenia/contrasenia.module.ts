import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContraseniaRoutingModule } from './contrasenia-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContraseniaComponent } from 'src/app/componentes/contrasenia/contrasenia.component';

@NgModule({
  declarations: [
    ContraseniaComponent,
  ],
  imports: [
    CommonModule,
    ContraseniaRoutingModule,
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
export class ContraseniaModule { }
