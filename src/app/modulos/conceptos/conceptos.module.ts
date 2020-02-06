import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConceptosRoutingModule } from './conceptos-routing.module';
import { ConceptosComponent } from 'src/app/componentes/conceptos/conceptos.component';
import { ConceptosService } from 'src/app/servicios/conceptos.service';
import { TipoConceptoSueldoService } from 'src/app/servicios/tipo-concepto-sueldo.service';
import { AfipConceptoSueldoGrupoService } from 'src/app/servicios/afip-concepto-sueldo-grupo.service';
import { AfipConceptoSueldoService } from 'src/app/servicios/afip-concepto-sueldo.service';
import { UnidadMedidaSueldoService } from 'src/app/servicios/unidad-medida-sueldo.service';
import { ConceptoCompartidoModule } from 'src/app/compartidos/concepto.compartido.module';

@NgModule({
  declarations: [
    ConceptosComponent,
  ],
  imports: [
    ConceptosRoutingModule,
    ConceptoCompartidoModule
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
