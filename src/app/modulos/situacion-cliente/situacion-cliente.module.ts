import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SituacionClienteRoutingModule } from './situacion-cliente-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SituacionClienteComponent } from 'src/app/componentes/situacion-cliente/situacion-cliente.component';
import { SituacionClienteService } from 'src/app/servicios/situacion-cliente.service';

@NgModule({
  declarations: [
    SituacionClienteComponent,
  ],
  imports: [
    CommonModule,
    SituacionClienteRoutingModule,
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
    SituacionClienteService
  ]
})
export class SituacionClienteModule { }
