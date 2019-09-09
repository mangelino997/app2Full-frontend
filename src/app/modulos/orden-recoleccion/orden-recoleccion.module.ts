import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdenRecoleccionRoutingModule } from './orden-recoleccion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdenRecoleccionComponent } from 'src/app/componentes/orden-recoleccion/orden-recoleccion.component';
import { TextMaskModule } from 'angular2-text-mask';
import { OrdenRecoleccionService } from 'src/app/servicios/orden-recoleccion.service';
import { OrdenRecoleccion } from 'src/app/modelos/ordenRecoleccion';

@NgModule({
  declarations: [
    OrdenRecoleccionComponent,
  ],
  imports: [
    CommonModule,
    OrdenRecoleccionRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule,
    MatDividerModule,
    TextMaskModule
  ],
  providers: [
    OrdenRecoleccionService,
    OrdenRecoleccion
  ]
})
export class OrdenRecoleccionModule { }
