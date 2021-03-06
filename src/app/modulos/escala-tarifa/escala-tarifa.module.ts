import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscalaTarifaRoutingModule } from './escala-tarifa-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EscalaTarifaComponent } from 'src/app/componentes/escala-tarifa/escala-tarifa.component';
import { EscalaTarifaService } from 'src/app/servicios/escala-tarifa.service';
import { TextMaskModule } from 'angular2-text-mask';
import { EscalaTarifa } from 'src/app/modelos/escalaTarifa';

@NgModule({
  declarations: [
    EscalaTarifaComponent,
  ],
  imports: [
    CommonModule,
    EscalaTarifaRoutingModule,
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
    MatIconModule,
    TextMaskModule
  ],
  providers: [
    EscalaTarifaService,
    EscalaTarifa
  ]
})
export class EscalaTarifaModule { }
