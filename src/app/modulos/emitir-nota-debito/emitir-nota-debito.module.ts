import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmitirNotaDebitoRoutingModule } from './emitir-nota-debito-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule, MatButtonModule, MatDialogModule, MatRadioModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmitirNotaDebitoComponent } from 'src/app/componentes/emitir-nota-debito/emitir-nota-debito.component';
import { NotaDebito } from 'src/app/modelos/notaDebito';
import { TextMaskModule } from 'angular2-text-mask';

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
    MatProgressBarModule,
    MatIconModule,
    TextMaskModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule
  ],
  providers: [
    NotaDebito
  ]
})
export class EmitirNotaDebitoModule { }
