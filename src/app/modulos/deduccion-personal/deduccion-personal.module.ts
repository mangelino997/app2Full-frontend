import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeduccionPersonalRoutingModule } from './deduccion-personal-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeduccionPersonalComponent } from 'src/app/componentes/deduccion-personal/deduccion-personal.component';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { AfipDeduccionPersonalService } from 'src/app/servicios/afip-deduccion-personal.service';
import { AfipDeduccionPersonal } from 'src/app/modelos/afipDeduccionPersonal';

@NgModule({
  declarations: [
    DeduccionPersonalComponent,
  ],
  imports: [
    CommonModule,
    DeduccionPersonalRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [
    SubopcionPestaniaService,
    AfipDeduccionPersonalService,
    AfipDeduccionPersonal
  ]
})
export class DeduccionPersonalModule { }
