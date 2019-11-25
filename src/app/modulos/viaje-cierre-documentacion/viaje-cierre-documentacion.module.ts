import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViajeCierreDocumentacionRoutingModule } from './viaje-cierre-documentacion-routing.module';
import { ViajeCierreDocumentacion } from 'src/app/modelos/viaje-cierre-documentacion';
import { ViajeCierreDocumentacionService } from 'src/app/servicios/viaje-cierre-documentacion.service';
import { ViajeCierreDocumentacionComponent } from 'src/app/componentes/viaje-cierre/viaje-cierre.component';
import { MatTabsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

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
    ViajeCierreDocumentacionService
  ]
})
export class ViajeCierreDocumentacionModule { }
