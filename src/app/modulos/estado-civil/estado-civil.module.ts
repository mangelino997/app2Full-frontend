import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadoCivilRoutingModule } from './estado-civil-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstadoCivilComponent } from 'src/app/componentes/estado-civil/estado-civil.component';
import { EstadoCivilService } from 'src/app/servicios/estado-civil.service';

@NgModule({
  declarations: [
    EstadoCivilComponent,
  ],
  imports: [
    CommonModule,
    EstadoCivilRoutingModule,
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
    EstadoCivilService
  ]
})
export class EstadoCivilModule { }
