import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VencimientosChoferesRoutingModule } from './vencimientos-choferes-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VencimientosChoferesComponent } from 'src/app/componentes/vencimientos-choferes/vencimientos-choferes.component';
import { PersonalService } from 'src/app/servicios/personal.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { Personal } from 'src/app/modelos/personal';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Foto } from 'src/app/modelos/foto';
import { Pdf } from 'src/app/modelos/pdf';

@NgModule({
  declarations: [
    VencimientosChoferesComponent
  ],
  imports: [
    CommonModule,
    VencimientosChoferesRoutingModule,
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
    PdfViewerModule,
    MatTooltipModule
  ],
  providers: [
    PersonalService,
    SubopcionPestaniaService,
    Personal,
    TipoDocumentoService,
    Foto,
    Pdf
  ],
  entryComponents: [ ]
})
export class VencimientosChoferesModule { }
