import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfipConceptoSueldoGrupoComponent } from 'src/app/componentes/afip-concepto-sueldo-grupo/afip-concepto-sueldo-grupo.component';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfipConceptoSueldoGrupoRoutingModule } from './afip-concepto-sueldo-routing.module';



@NgModule({
  declarations: [
    AfipConceptoSueldoGrupoComponent
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
    AfipConceptoSueldoGrupoRoutingModule
  ],
  providers: [
  ]
})
export class AfipConceptoSueldoGrupoModule { }
