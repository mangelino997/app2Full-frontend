import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BugImagenDialogoRoutingModule } from './bug-imagen-dialogo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BugImagenDialogoComponent } from 'src/app/componentes/bugImagen-dialogo/bug-imagen-dialogo.component';

@NgModule({
  declarations: [
    BugImagenDialogoComponent,
  ],
  imports: [
    CommonModule,
    BugImagenDialogoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule
  ]
})
export class BugImagenDialogoModule { }
