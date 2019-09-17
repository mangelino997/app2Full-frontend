import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteDialogoRoutingModule } from '../reporte-dialogo/reporte-dialogo-routing.module';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule, MatToolbarModule, MatDialogModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObservacionDialogComponent } from 'src/app/componentes/observacion-dialog/observacion-dialog.component';
@NgModule({
  declarations: [
    ObservacionDialogComponent
  ],
  imports: [
    CommonModule,
    ReporteDialogoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule
  ],
  entryComponents: [
    ObservacionDialogComponent
  ]
})
export class ObservacionDialogModule { }
