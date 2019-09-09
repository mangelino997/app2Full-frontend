import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdelantoLoteRoutingModule } from './adelanto-lote-routing.module';
import { AdelantoLoteComponent } from 'src/app/componentes/adelanto-lote/adelanto-lote.component';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    AdelantoLoteComponent,
  ],
  imports: [
    CommonModule,
    AdelantoLoteRoutingModule,
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
export class AdelantoLoteModule { }
