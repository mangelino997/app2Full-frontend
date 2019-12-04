import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViajeCierreDocumentacionRoutingModule } from './viaje-cierre-documentacion-routing.module';
import { ViajeCierreDocumentacion } from 'src/app/modelos/viaje-cierre-documentacion';
import { ViajeCierreDocumentacionService } from 'src/app/servicios/viaje-cierre-documentacion.service';
import { ViajeCierreDocumentacionComponent } from 'src/app/componentes/viaje-cierre-documentacion/viaje-cierre-documentacion.component';
import { MatTabsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { ViajeService } from 'src/app/servicios/viaje.service';
import { LoaderService } from 'src/app/servicios/loader.service';

@NgModule({
  declarations: [
    ViajeCierreDocumentacionComponent
  ],
  imports: [
    CommonModule,
    ViajeCierreDocumentacionRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  providers: [
    ViajeCierreDocumentacion,
    ViajeCierreDocumentacionService,
    SubopcionPestaniaService,
    ViajeService,
    LoaderService
  ]
})
export class ViajeCierreDocumentacionModule { }
