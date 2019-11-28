import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AfipCondicionIvaRoutingModule } from './afip-condicion-iva-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfipCondicionIvaComponent } from 'src/app/componentes/afip-condicion-iva/afip-condicion-iva.component';
import { AfipCondicionIvaService } from 'src/app/servicios/afip-condicion-iva.service';
import { AfipCondicionIva } from 'src/app/modelos/afipCondicionIva';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    AfipCondicionIvaComponent,
  ],
  imports: [
    CommonModule,
    AfipCondicionIvaRoutingModule,
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
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    AfipCondicionIvaService,
    AfipCondicionIva,
    SubopcionPestaniaService
  ]
})
export class AfipCondicionIvaModule { }
