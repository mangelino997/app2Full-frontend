import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CobradorRoutingModule } from './cobrador-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatDialogModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CobradorComponent } from 'src/app/componentes/cobrador/cobrador.component';
import { CobradorService } from 'src/app/servicios/cobrador.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { Cobrador } from 'src/app/modelos/cobrador';

@NgModule({
  declarations: [
    CobradorComponent,
  ],
  imports: [
    CommonModule,
    CobradorRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    CobradorService,
    SubopcionPestaniaService,
    CobradorService,
    Cobrador
  ]
})
export class CobradorModule { }
