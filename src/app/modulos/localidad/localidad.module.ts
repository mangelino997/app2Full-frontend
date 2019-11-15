import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalidadRoutingModule } from './localidad-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule, MatToolbarModule, MatDialogModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalidadComponent } from 'src/app/componentes/localidad/localidad.component';
import { TextMaskModule } from 'angular2-text-mask';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ProvinciaService } from 'src/app/servicios/provincia.service';
import { ReporteDialogoComponent } from 'src/app/componentes/reporte-dialogo/reporte-dialogo.component';
import { Localidad } from 'src/app/modelos/localidad';

@NgModule({
  declarations: [
    LocalidadComponent,
    //ReporteDialogoComponent
  ],
  imports: [
    CommonModule,
    LocalidadRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    TextMaskModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    TextMaskModule
  ],
  providers: [
    LocalidadService,
    Localidad,
    SubopcionPestaniaService,
    ProvinciaService
  ],
})
export class LocalidadModule { }
