import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubopcionPestaniaRoutingModule } from './subopcion-pestania-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubopcionPestaniaComponent } from 'src/app/componentes/subopcion-pestania/subopcion-pestania.component';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    SubopcionPestaniaComponent,
  ],
  imports: [
    CommonModule,
    SubopcionPestaniaRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  providers: [
    SubopcionPestaniaService
  ]
})
export class SubopcionPestaniaModule { }
