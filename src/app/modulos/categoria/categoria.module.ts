import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRoutingModule } from './categoria-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriaComponent } from 'src/app/componentes/categoria/categoria.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { Categoria } from 'src/app/modelos/categoria';

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
    MatButtonModule,
    TextMaskModule,
    MatIconModule
  ],
  providers: [
    CategoriaService,
    SubopcionPestaniaService,
    Categoria
  ]
})
export class CategoriaModule { }
