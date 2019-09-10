import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteDialogoRoutingModule } from './reporte-dialogo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule, MatToolbarModule, MatDialogModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReporteDialogoComponent } from 'src/app/componentes/reporte-dialogo/reporte-dialogo.component';

@NgModule({
  declarations: [
    ReporteDialogoComponent,
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
    ReporteDialogoComponent
  ]
})
export class ReporteDialogoModule { }
