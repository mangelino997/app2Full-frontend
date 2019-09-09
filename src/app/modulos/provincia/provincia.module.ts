import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvinciaRoutingModule } from './provincia-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProvinciaComponent } from 'src/app/componentes/provincia/provincia.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ProvinciaService } from 'src/app/servicios/provincia.service';

@NgModule({
  declarations: [
    ProvinciaComponent,
  ],
  imports: [
    CommonModule,
    ProvinciaRoutingModule,
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
    ProvinciaService
  ]
})
export class ProvinciaModule { }
