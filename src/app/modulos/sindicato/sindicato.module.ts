import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SindicatoRoutingModule } from './sindicato-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SindicatoComponent } from 'src/app/componentes/sindicato/sindicato.component';
import { SindicatoService } from 'src/app/servicios/sindicato.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

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
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [
    SindicatoService,
    SubopcionPestaniaService
  ]
})
export class SindicatoModule { }
