import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConceptosRoutingModule } from './conceptos-routing.module';
import { ConceptosComponent } from 'src/app/componentes/conceptos/conceptos.component';
import { ConceptosService } from 'src/app/servicios/conceptos.service';
import { MatSelectModule, MatAutocompleteModule, MatButtonModule, MatTabsModule, MatTableModule, MatPaginatorModule,
   MatSortModule, MatProgressBarModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoConceptoSueldoService } from 'src/app/servicios/tipo-concepto-sueldo.service';
import { AfipConceptoSueldoGrupoService } from 'src/app/servicios/afip-concepto-sueldo-grupo.service';
import { AfipConceptoSueldoService } from 'src/app/servicios/afip-concepto-sueldo.service';
import { UnidadMedidaSueldoService } from 'src/app/servicios/unidad-medida-sueldo.service';

@NgModule({
  declarations: [
    ConceptosComponent
  ],
  imports: [
    CommonModule,
    ConceptosRoutingModule,
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
    MatTooltipModule
  ],
  providers: [
    ConceptosService,
    TipoConceptoSueldoService,
    AfipConceptoSueldoGrupoService,
    AfipConceptoSueldoService,
    UnidadMedidaSueldoService,
  ]
})
export class ConceptosModule { }
