import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeduccionGeneralTopeRoutingModule } from './deduccion-general-tope-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeduccionGeneralTopeComponent } from 'src/app/componentes/deduccion-general-tope/deduccion-general-tope.component';
import { TextMaskModule } from 'angular2-text-mask';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AfipDeduccionGeneralTopeService } from 'src/app/servicios/afip-deduccion-general-tope.service';
import { AfipDeduccionGeneralTope } from 'src/app/modelos/afipDeduccionGeneralTope';
import { AfipDeduccionGeneralService } from 'src/app/servicios/afip-deduccion-general.service';

@NgModule({
  declarations: [
    DeduccionGeneralTopeComponent,
  ],
  imports: [
    CommonModule,
    DeduccionGeneralTopeRoutingModule,
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
    TextMaskModule
  ],
  providers: [
    SubopcionPestaniaService,
    AfipDeduccionGeneralTopeService,
    AfipDeduccionGeneralTope,
    AfipDeduccionGeneralService
  ]
})
export class DeduccionGeneralTopeModule { }
