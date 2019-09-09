import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResumenClienteRoutingModule } from './resumen-cliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResumenClienteComponent } from 'src/app/componentes/resumen-cliente/resumen-cliente.component';
import { ResumenClienteService } from 'src/app/servicios/resumen-cliente.service';

@NgModule({
  declarations: [
    ResumenClienteComponent,
  ],
  imports: [
    CommonModule,
    ResumenClienteRoutingModule,
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
    ResumenClienteService
  ]
})
export class ResumenClienteModule { }
