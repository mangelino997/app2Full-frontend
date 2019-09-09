import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoporteRoutingModule } from './soporte-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SoporteComponent } from 'src/app/componentes/soporte/soporte.component';
import { SoporteService } from 'src/app/servicios/soporte.service';

@NgModule({
  declarations: [
    SoporteComponent,
  ],
  imports: [
    CommonModule,
    SoporteRoutingModule,
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
    SoporteService
  ]
})
export class SoporteModule { }
