import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdfDialogoRoutingModule } from './pdf-dialogo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfDialogoComponent } from 'src/app/componentes/pdf-dialogo/pdf-dialogo.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    PdfDialogoComponent,
  ],
  imports: [
    CommonModule,
    PdfDialogoRoutingModule,
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
    PdfViewerModule
  ]
})
export class PdfDialogoModule { }
