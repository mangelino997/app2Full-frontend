import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EjercicioRoutingModule } from './ejercicio-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EjercicioComponent } from 'src/app/componentes/ejercicio/ejercicio.component';
import { EjercicioService } from 'src/app/servicios/ejercicio.service';
import { Ejercicio } from 'src/app/modelos/ejercicio';

@NgModule({
  declarations: [
    EjercicioComponent,
  ],
  imports: [
    CommonModule,
    EjercicioRoutingModule,
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
    MatIconModule
  ],
  providers: [
    EjercicioService,
    Ejercicio,
  ]
})
export class EjercicioModule { }
