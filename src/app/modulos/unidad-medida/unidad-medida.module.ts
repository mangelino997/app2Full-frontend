import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadMedidaRoutingModule } from './unidad-medida-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnidadMedidaComponent } from 'src/app/componentes/unidad-medida/unidad-medida.component';
import { UnidadMedidaService } from 'src/app/servicios/unidad-medida.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

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
    MatProgressBarModule
  ],
  providers: [
    SubopcionPestaniaService,
    UnidadMedidaService
  ]
})
export class UnidadMedidaModule { }
