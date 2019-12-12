import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViajeTipoRoutingModule } from './viaje-tipo-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViajeTipoComponent } from 'src/app/componentes/viaje-tipo/viaje-tipo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ViajeTipoService } from 'src/app/servicios/viaje-tipo.service';
import { ViajeTipo } from 'src/app/modelos/viajeTipo';

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
    MatButtonModule,
    TextMaskModule,
    MatIconModule
  ],
  providers: [
    ViajeTipoService,
    ViajeTipo
  ]
})
export class ViajeTipoModule { }
