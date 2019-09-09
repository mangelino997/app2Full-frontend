import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TramoRoutingModule } from './tramo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TramoComponent } from 'src/app/componentes/tramo/tramo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { TramoService } from 'src/app/servicios/tramo.service';

@NgModule({
  declarations: [
    TramoComponent,
  ],
  imports: [
    CommonModule,
    TramoRoutingModule,
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
  ],
  providers: [
    TramoService
  ]
})
export class TramoModule { }
