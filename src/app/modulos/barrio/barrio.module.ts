import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarrioRoutingModule } from './barrio-routing.module';
import { BarrioComponent } from 'src/app/componentes/barrio/barrio.component';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    BarrioComponent
  ],
  imports: [
    CommonModule,
    BarrioRoutingModule,
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
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    BarrioService,
    SubopcionPestaniaService
  ]
})
export class BarrioModule { }