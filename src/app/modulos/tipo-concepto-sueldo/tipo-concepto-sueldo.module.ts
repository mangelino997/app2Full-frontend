import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoConceptoSueldoComponent } from 'src/app/componentes/tipo-concepto-sueldo/tipo-concepto-sueldo.component';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoConceptoSueldoRoutingModule } from './tipo-concepto-sueldo-routing.module';



@NgModule({
  declarations: [
    TipoConceptoSueldoComponent
  ],
  imports: [
    CommonModule,
    TipoConceptoSueldoRoutingModule,
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
  ]
})
export class TipoConceptoSueldoModule { }
