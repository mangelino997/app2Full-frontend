import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CobradorRoutingModule } from './cobrador-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CobradorComponent } from 'src/app/componentes/cobrador/cobrador.component';
import { CobradorService } from 'src/app/servicios/cobrador.service';

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
    MatProgressBarModule
  ],
  providers: [
    CobradorService
  ]
})
export class CobradorModule { }
