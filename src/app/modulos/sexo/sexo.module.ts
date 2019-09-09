import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SexoRoutingModule } from './sexo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SexoComponent } from 'src/app/componentes/sexo/sexo.component';
import { SexoService } from 'src/app/servicios/sexo.service';

@NgModule({
  declarations: [
    SexoComponent,
  ],
  imports: [
    CommonModule,
    SexoRoutingModule,
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
    SexoService
  ]
})
export class SexoModule { }
