import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoRetencionRoutingModule } from './tipo-retencion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoRetencionComponent } from 'src/app/componentes/tipo-retencion/tipo-retencion.component';

@NgModule({
  declarations: [
    TipoRetencionComponent,
  ],
  imports: [
    CommonModule,
    TipoRetencionRoutingModule,
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
export class TipoRetencionModule { }
