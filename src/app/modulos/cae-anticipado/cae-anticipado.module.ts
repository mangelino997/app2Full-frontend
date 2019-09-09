import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaeAnticipadoRoutingModule } from './cae-anticipado-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaeAnticipadoComponent } from 'src/app/componentes/cae-anticipado/cae-anticipado.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    CaeAnticipadoComponent,
  ],
  imports: [
    CommonModule,
    CaeAnticipadoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    TextMaskModule
  ]
})
export class CaeAnticipadoModule { }
