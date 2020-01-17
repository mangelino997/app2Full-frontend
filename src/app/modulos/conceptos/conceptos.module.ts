import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConceptosRoutingModule } from './conceptos-routing.module';
import { ConceptosComponent } from 'src/app/componentes/conceptos/conceptos.component';
import { ConceptosService } from 'src/app/servicios/conceptos.service';
import { MatSelectModule, MatButtonModule, MatAutocompleteModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoConceptoSueldoService } from 'src/app/servicios/tipo-concepto-sueldo.service';

@NgModule({
  declarations: [
    ConceptosComponent
  ],
  imports: [
    CommonModule,
    ConceptosRoutingModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  providers: [
    ConceptosService,
    TipoConceptoSueldoService
  ]
})
export class ConceptosModule { }
