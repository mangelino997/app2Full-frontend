import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmpresaComponent } from 'src/app/componentes/empresa/empresa.component';
import { TextMaskModule } from 'angular2-text-mask';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { Empresa } from 'src/app/modelos/empresa';

@NgModule({
  declarations: [
    EmpresaComponent,
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
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
  ],
  providers: [
    EmpresaService,
    Empresa
  ]
})
export class EmpresaModule { }
