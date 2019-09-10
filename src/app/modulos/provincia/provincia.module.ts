import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvinciaRoutingModule } from './provincia-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProvinciaComponent } from 'src/app/componentes/provincia/provincia.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { PaisService } from 'src/app/servicios/pais.service';

@NgModule({
  declarations: [
    ProvinciaComponent,
  ],
  imports: [
    CommonModule,
    ProvinciaRoutingModule,
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
    TextMaskModule
  ],
  providers: [
    ProvinciaService,
    SubopcionPestaniaService,
    PaisService
  ]
})
export class ProvinciaModule { }
