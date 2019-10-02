import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TramoRoutingModule } from './tramo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TramoComponent } from 'src/app/componentes/tramo/tramo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { TramoService } from 'src/app/servicios/tramo.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { OrigenDestinoService } from 'src/app/servicios/origen-destino.service';
import { Tramo } from 'src/app/modelos/tramo';

@NgModule({
  declarations: [
    TramoComponent,
  ],
  imports: [
    CommonModule,
    TramoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule,
    TextMaskModule,
    MatIconModule
  ],
  providers: [
    TramoService,
    SubopcionPestaniaService,
    OrigenDestinoService,
    Tramo
  ]
})
export class TramoModule { }
