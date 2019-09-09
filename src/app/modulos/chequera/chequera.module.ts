import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChequeraRoutingModule } from './chequera-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChequeraComponent } from 'src/app/componentes/chequera/chequera.component';
import { ChequeraService } from 'src/app/servicios/chequera.service';

@NgModule({
  declarations: [
    ChequeraComponent,
  ],
  imports: [
    CommonModule,
    ChequeraRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  providers: [
    ChequeraService
  ]
})
export class ChequeraModule { }
