import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConceptosRoutingModule } from './conceptos-routing.module';
import { ConceptosComponent } from 'src/app/componentes/conceptos/conceptos.component';
import { ConceptosService } from 'src/app/servicios/conceptos.service';
import { MatSelectModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ConceptosComponent
  ],
  imports: [
    CommonModule,
    ConceptosRoutingModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule
  ],
  providers: [
    ConceptosService
  ]
})
export class ConceptosModule { }
