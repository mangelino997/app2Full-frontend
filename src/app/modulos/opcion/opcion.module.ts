import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpcionRoutingModule } from './opcion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpcionComponent } from 'src/app/componentes/opcion/opcion.component';
import { OpcionService } from 'src/app/servicios/opcion.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { SubopcionService } from 'src/app/servicios/subopcion.service';

@NgModule({
  declarations: [
    OpcionComponent,
  ],
  imports: [
    CommonModule,
    OpcionRoutingModule,
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
    OpcionService,
    SubopcionPestaniaService,
    SubopcionService
  ]
})
export class OpcionModule { }
