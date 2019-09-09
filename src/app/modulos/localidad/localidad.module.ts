import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalidadRoutingModule } from './localidad-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalidadComponent } from 'src/app/componentes/localidad/localidad.component';
import { TextMaskModule } from 'angular2-text-mask';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';

@NgModule({
  declarations: [
    LocalidadComponent,
  ],
  imports: [
    CommonModule,
    LocalidadRoutingModule,
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
    TextMaskModule
  ],
  providers: [
    LocalidadService,
    SubopcionPestaniaService,
    ProvinciaService,
  ]
})
export class LocalidadModule { }
