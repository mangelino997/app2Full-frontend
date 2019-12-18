import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfipConceptoSueldoComponent } from 'src/app/componentes/afip-concepto-sueldo/afip-concepto-sueldo.component';
import { AfipConceptoSueldoRoutingModule } from './afip-concepto-sueldo-routing.module';



@NgModule({
  declarations: [
    AfipConceptoSueldoComponent
  ],
  imports: [
    CommonModule,
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
    MatIconModule,
    MatTooltipModule,
    AfipConceptoSueldoRoutingModule
  ],
  providers: [

  ]
})
export class AfipConceptoSueldoModule { }
