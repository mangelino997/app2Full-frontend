import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrigenDestinoRoutingModule } from './origen-destino-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrigenDestinoComponent } from 'src/app/componentes/origen-destino/origen-destino.component';
import { OrigenDestinoService } from 'src/app/servicios/origen-destino.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';

@NgModule({
  declarations: [
    OrigenDestinoComponent,
  ],
  imports: [
    CommonModule,
    OrigenDestinoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [
    OrigenDestinoService,
    SubopcionPestaniaService,
    ProvinciaService
  ]
})
export class OrigenDestinoModule { }
