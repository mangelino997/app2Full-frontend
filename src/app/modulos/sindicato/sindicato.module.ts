import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SindicatoRoutingModule } from './sindicato-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SindicatoComponent } from 'src/app/componentes/sindicato/sindicato.component';
import { SindicatoService } from 'src/app/servicios/sindicato.service';

@NgModule({
  declarations: [
    SindicatoComponent,
  ],
  imports: [
    CommonModule,
    SindicatoRoutingModule,
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
    SindicatoService
  ]
})
export class SindicatoModule { }
