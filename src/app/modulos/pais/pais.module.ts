import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaisRoutingModule } from './pais-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaisComponent } from 'src/app/componentes/pais/pais.component';
import { PaisService } from 'src/app/servicios/pais.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    PaisComponent,
  ],
  imports: [
    CommonModule,
    PaisRoutingModule,
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
    PaisService,
    SubopcionPestaniaService
  ]
})
export class PaisModule { }
