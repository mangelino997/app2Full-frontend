import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoDocumentoRoutingModule } from './tipo-documento-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoDocumentoComponent } from 'src/app/componentes/tipo-documento/tipo-documento.component';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';

@NgModule({
  declarations: [
    TipoDocumentoComponent,
  ],
  imports: [
    CommonModule,
    TipoDocumentoRoutingModule,
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
    TipoDocumentoService
  ]
})
export class TipoDocumentoModule { }
