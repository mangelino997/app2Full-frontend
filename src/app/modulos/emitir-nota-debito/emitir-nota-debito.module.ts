import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitirNotaDebitoRoutingModule } from './emitir-nota-debito-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmitirNotaDebitoComponent } from 'src/app/componentes/emitir-nota-debito/emitir-nota-debito.component';
import { NotaDebito } from 'src/app/modelos/notaDebito';

@NgModule({
  declarations: [
    EmitirNotaDebitoComponent,
  ],
  imports: [
    CommonModule,
    EmitirNotaDebitoRoutingModule,
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
    NotaDebito
  ]
})
export class EmitirNotaDebitoModule { }
