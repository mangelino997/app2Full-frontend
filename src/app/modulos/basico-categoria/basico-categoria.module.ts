import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicoCategoriaRoutingModule } from './basico-categoria-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicoCategoriaComponent } from 'src/app/componentes/basico-categoria/basico-categoria.component';
import { TextMaskModule } from 'angular2-text-mask';
import { BasicoCategoriaService } from 'src/app/servicios/basico-categoria.service';

@NgModule({
  declarations: [
    BasicoCategoriaComponent,
  ],
  imports: [
    CommonModule,
    BasicoCategoriaRoutingModule,
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
    BasicoCategoriaService
  ]
})
export class BasicoCategoriaModule { }
