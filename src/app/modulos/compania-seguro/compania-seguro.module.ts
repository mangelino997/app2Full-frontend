import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniaSeguroRoutingModule } from './compania-seguro-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompaniaSeguroComponent } from 'src/app/componentes/compania-seguro/compania-seguro.component';
import { CompaniaSeguroService } from 'src/app/servicios/compania-seguro.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    CompaniaSeguroComponent,
  ],
  imports: [
    CommonModule,
    CompaniaSeguroRoutingModule,
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
    CompaniaSeguroService,
    SubopcionPestaniaService
  ]
})
export class CompaniaSeguroModule { }
