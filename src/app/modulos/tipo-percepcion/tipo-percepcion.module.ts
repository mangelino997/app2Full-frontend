import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoPercepcionRoutingModule } from './tipo-percepcion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoPercepcionComponent } from 'src/app/componentes/tipo-percepcion/tipo-percepcion.component';

@NgModule({
  declarations: [
    TipoPercepcionComponent,
  ],
  imports: [
    CommonModule,
    TipoPercepcionRoutingModule,
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
export class TipoPercepcionModule { }
