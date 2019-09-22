import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubopcionRoutingModule } from './subopcion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubopcionComponent } from 'src/app/componentes/subopcion/subopcion.component';
import { SubopcionService } from 'src/app/servicios/subopcion.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { SubmoduloService } from 'src/app/servicios/submodulo.service';

@NgModule({
  declarations: [
    SubopcionComponent,
  ],
  imports: [
    CommonModule,
    SubopcionRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [
    SubopcionService,
    SubopcionPestaniaService,
    ModuloService,
    SubmoduloService
  ]
})
export class SubopcionModule { }
