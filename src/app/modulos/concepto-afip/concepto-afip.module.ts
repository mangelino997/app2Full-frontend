import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConceptoAfipRoutingModule } from './concepto-afip-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConceptoAfipComponent } from 'src/app/componentes/concepto-afip/concepto-afip.component';
import { ConceptoAfip } from 'src/app/modelos/concepto-afip';

@NgModule({
  declarations: [
    ConceptoAfipComponent,
  ],
  imports: [
    CommonModule,
    ConceptoAfipRoutingModule,
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
    MatTooltipModule
  ],
  providers: [
    ConceptoAfip
  ]
})
export class ConceptoAfipModule { }
