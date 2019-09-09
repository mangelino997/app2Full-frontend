import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniaSeguroPolizaRoutingModule } from './compania-seguro-poliza-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompaniaSeguroPolizaComponent } from 'src/app/componentes/compania-seguro-poliza/compania-seguro-poliza.component';
import { CompaniaSeguroPolizaService } from 'src/app/servicios/compania-seguro-poliza.service';
import { CompaniaSeguroPoliza } from 'src/app/modelos/companiaSeguroPoliza';

@NgModule({
  declarations: [
    CompaniaSeguroPolizaComponent,
  ],
  imports: [
    CommonModule,
    CompaniaSeguroPolizaRoutingModule,
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
    CompaniaSeguroPolizaService,
    CompaniaSeguroPoliza
  ]
})
export class CompaniaSeguroPolizaModule { }
