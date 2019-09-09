import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRoutingModule } from './categoria-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriaComponent } from 'src/app/componentes/categoria/categoria.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CategoriaService } from 'src/app/servicios/categoria.service';

@NgModule({
  declarations: [
    CategoriaComponent,
  ],
  imports: [
    CommonModule,
    CategoriaRoutingModule,
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
    CategoriaService
  ]
})
export class CategoriaModule { }
