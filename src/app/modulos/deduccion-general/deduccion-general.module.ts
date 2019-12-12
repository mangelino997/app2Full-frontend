import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeduccionGeneralRoutingModule } from './deduccion-general-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeduccionGeneralComponent } from 'src/app/componentes/deduccion-general/deduccion-general.component';
import { AfipDeduccionGeneralService } from 'src/app/servicios/afip-deduccion-general.service';
import { AfipDeduccionGeneral } from 'src/app/modelos/afipDeduccionGeneral';

@NgModule({
  declarations: [
    DeduccionGeneralComponent,
  ],
  imports: [
    CommonModule,
    DeduccionGeneralRoutingModule,
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
    MatIconModule
  ],
  providers: [
    AfipDeduccionGeneralService,
    AfipDeduccionGeneral
  ]
})
export class DeduccionGeneralModule { }
