import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubopcionRoutingModule } from './subopcion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubopcionComponent } from 'src/app/componentes/subopcion/subopcion.component';
import { SubopcionService } from 'src/app/servicios/subopcion.service';

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
    MatProgressBarModule
  ],
  providers: [
    SubopcionService
  ]
})
export class SubopcionModule { }
