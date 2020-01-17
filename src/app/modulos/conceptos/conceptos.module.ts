import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConceptosRoutingModule } from './conceptos-routing.module';
import { ConceptosComponent } from 'src/app/componentes/conceptos/conceptos.component';
import { ConceptosService } from 'src/app/servicios/conceptos.service';

@NgModule({
  declarations: [
    ConceptosComponent
  ],
  imports: [
    CommonModule,
    ConceptosRoutingModule
  ],
  providers: [
    ConceptosService
  ]
})
export class ConceptosModule { }
