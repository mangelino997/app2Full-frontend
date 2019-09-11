import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoRetencionRoutingModule } from './tipo-retencion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoRetencionComponent } from 'src/app/componentes/tipo-retencion/tipo-retencion.component';
import { TipoRetencionService } from 'src/app/servicios/tipo-retencion.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { TipoRetencion } from 'src/app/modelos/tipoRetencion';

@NgModule({
  declarations: [
    TipoRetencionComponent,
  ],
  imports: [
    CommonModule,
    TipoRetencionRoutingModule,
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
    TipoRetencionService,
    SubopcionPestaniaService,
    TipoRetencion
  ]
})
export class TipoRetencionModule { }
