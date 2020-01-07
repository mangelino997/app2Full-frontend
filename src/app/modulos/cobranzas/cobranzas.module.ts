import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CobranzasRoutingModule } from './cobranzas-routing.module';
import { CobranzasComponent } from 'src/app/componentes/cobranzas/cobranzas.component';
import { MatButtonModule, MatTableModule, MatTabsModule, MatAutocompleteModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatDialogModule, MatIconModule, MatTooltipModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CobranzasComponent
  ],
  imports: [
    CommonModule,
    CobranzasRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class CobranzasModule { }
