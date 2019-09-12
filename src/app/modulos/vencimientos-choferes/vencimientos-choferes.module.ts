import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VencimientosChoferesRoutingModule } from './vencimientos-choferes-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VencimientosChoferesComponent } from 'src/app/componentes/vencimientos-choferes/vencimientos-choferes.component';
import { PersonalService } from 'src/app/servicios/personal.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { Personal } from 'src/app/modelos/personal';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { BugImagenDialogoComponent } from 'src/app/componentes/bugImagen-dialogo/bug-imagen-dialogo.component';
import { PdfDialogoComponent } from 'src/app/componentes/pdf-dialogo/pdf-dialogo.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Foto } from 'src/app/modelos/foto';
import { Pdf } from 'src/app/modelos/pdf';

@NgModule({
  declarations: [
    VencimientosChoferesComponent,
    BugImagenDialogoComponent,
    PdfDialogoComponent
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
    PdfViewerModule
  ],
  providers: [
    PersonalService,
    SubopcionPestaniaService,
    Personal,
    TipoDocumentoService,
    Foto,
    Pdf
  ],
  entryComponents: [
    BugImagenDialogoComponent,
    PdfDialogoComponent
  ]
})
export class VencimientosChoferesModule { }