import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeduccionPersonalTablaRoutingModule } from './deduccion-personal-tabla-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeduccionPersonalTablaComponent, ImporteAnualDialogo } from 'src/app/componentes/deduccion-personal-tabla/deduccion-personal-tabla.component';
import { TextMaskModule } from 'angular2-text-mask';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AfipTipoBeneficioDeduccionService } from 'src/app/servicios/afip-tipo-beneficio-deduccion.service';
import { AfipDeduccionPersonalTabla } from 'src/app/modelos/afipDeduccionPersonalTabla';
import { MesService } from 'src/app/servicios/mes.service';
import { AfipTipoBeneficioService } from 'src/app/servicios/afip-tipo-beneficio.service';
import { AfipDeduccionPersonalService } from 'src/app/servicios/afip-deduccion-personal.service';

@NgModule({
  declarations: [
    DeduccionPersonalTablaComponent,
    ImporteAnualDialogo
  ],
  imports: [
    CommonModule,
    DeduccionPersonalTablaRoutingModule,
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
    MatDialogModule,
    TextMaskModule
  ],
  providers: [
    SubopcionPestaniaService,
    AfipTipoBeneficioDeduccionService,
    AfipDeduccionPersonalTabla,
    MesService,
    AfipTipoBeneficioService,
    AfipDeduccionPersonalService
  ],
  entryComponents: [
    ImporteAnualDialogo
  ]
})
export class DeduccionPersonalTablaModule { }
