import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubmoduloRoutingModule } from './submodulo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmoduloComponent } from 'src/app/componentes/submodulo/submodulo.component';
import { SubmoduloService } from 'src/app/servicios/submodulo.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ModuloService } from 'src/app/servicios/modulo.service';

@NgModule({
  declarations: [
    SubmoduloComponent,
  ],
  imports: [
    CommonModule,
    SubmoduloRoutingModule,
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
    SubmoduloService,
    SubopcionPestaniaService,
    ModuloService
  ]
})
export class SubmoduloModule { }
