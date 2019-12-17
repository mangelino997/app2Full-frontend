import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadMedidaRoutingModule } from './unidad-medida-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatIconModule, MatButtonModule, MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnidadMedidaComponent } from 'src/app/componentes/unidad-medida/unidad-medida.component';
import { UnidadMedidaService } from 'src/app/servicios/unidad-medida.service';

@NgModule({
  declarations: [
    UnidadMedidaComponent,
  ],
  imports: [
    CommonModule,
    UnidadMedidaRoutingModule,
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
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [
    UnidadMedidaService
  ]
})
export class UnidadMedidaModule { }
