import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViajeTipoRoutingModule } from './viaje-tipo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViajeTipoComponent } from 'src/app/componentes/viaje-tipo/viaje-tipo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ViajeTipoService } from 'src/app/servicios/viaje-tipo.service';

@NgModule({
  declarations: [
    ViajeTipoComponent,
  ],
  imports: [
    CommonModule,
    ViajeTipoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    TextMaskModule
  ],
  providers: [
    ViajeTipoService
  ]
})
export class ViajeTipoModule { }
