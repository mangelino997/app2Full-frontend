import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpcionRoutingModule } from './opcion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpcionComponent } from 'src/app/componentes/opcion/opcion.component';
import { OpcionService } from 'src/app/servicios/opcion.service';

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
    MatProgressBarModule
  ],
  providers: [
    OpcionService
  ]
})
export class OpcionModule { }
