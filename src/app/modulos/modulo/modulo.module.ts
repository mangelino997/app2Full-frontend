import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuloRoutingModule } from './modulo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModuloComponent } from 'src/app/componentes/modulo/modulo.component';
import { ModuloService } from 'src/app/servicios/modulo.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    ModuloComponent,
  ],
  imports: [
    CommonModule,
    ModuloRoutingModule,
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
    ModuloService,
    SubopcionPestaniaService
  ]
})
export class ModuloModule { }
