import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmarDialogoRoutingModule } from './confirmar-dialogo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmarDialogoComponent } from 'src/app/componentes/confirmar-dialogo/confirmar-dialogo.component';

@NgModule({
  declarations: [
    ConfirmarDialogoComponent,
  ],
  imports: [
    CommonModule,
    ConfirmarDialogoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDialogModule
  ]
})
export class ConfirmarDialogoModule { }
