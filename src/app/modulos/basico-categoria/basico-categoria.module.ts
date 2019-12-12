import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicoCategoriaRoutingModule } from './basico-categoria-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicoCategoriaComponent } from 'src/app/componentes/basico-categoria/basico-categoria.component';
import { TextMaskModule } from 'angular2-text-mask';
import { BasicoCategoriaService } from 'src/app/servicios/basico-categoria.service';
import { BasicoCategoria } from 'src/app/modelos/basicoCategoria';

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
    MatButtonModule,
    TextMaskModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    BasicoCategoriaService,
    BasicoCategoria,
  ]
})
export class BasicoCategoriaModule { }
