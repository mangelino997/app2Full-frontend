import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatIconModule, MatDividerModule, MatDialogModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalComponent } from 'src/app/componentes/personal/personal.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PersonalService } from 'src/app/servicios/personal.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { RolOpcionService } from 'src/app/servicios/rol-opcion.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { SexoService } from 'src/app/servicios/sexo.service';
import { EstadoCivilService } from 'src/app/servicios/estado-civil.service';
import { TipoDocumentoService } from 'src/app/servicios/tipo-documento.service';
import { SucursalService } from 'src/app/servicios/sucursal.service';
import { AreaService } from 'src/app/servicios/area.service';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { SindicatoService } from 'src/app/servicios/sindicato.service';
import { SeguridadSocialService } from 'src/app/servicios/seguridad-social.service';
import { ObraSocialService } from 'src/app/servicios/obra-social.service';
import { AfipCondicionService } from 'src/app/servicios/afip-condicion.service';
import { AfipModContratacionService } from 'src/app/servicios/afip-mod-contratacion.service';
import { AfipSituacionService } from 'src/app/servicios/afip-situacion.service';
import { FotoService } from 'src/app/servicios/foto.service';
import { PdfService } from 'src/app/servicios/pdf.service';
import { AfipActividadService } from 'src/app/servicios/afip-actividad.service';
import { AfipLocalidadService } from 'src/app/servicios/afip-localidad.service';
import { AfipSiniestradoService } from 'src/app/servicios/afip-siniestrado.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Personal } from 'src/app/modelos/personal';
import { Foto } from 'src/app/modelos/foto';
import { Pdf } from 'src/app/modelos/pdf';

@NgModule({
  declarations: [
    PersonalComponent,
  ],
  imports: [
    CommonModule,
    PersonalRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    TextMaskModule,
    PdfViewerModule
  ],
  providers: [
    PersonalService,
    SubopcionPestaniaService,
    PersonalService,
    RolOpcionService,
    BarrioService,
    LocalidadService,
    SexoService,
    EstadoCivilService,
    TipoDocumentoService,
    SucursalService,
    AreaService,
    CategoriaService,
    SindicatoService,
    SeguridadSocialService,
    ObraSocialService,
    AfipActividadService,
    AfipCondicionService,
    AfipLocalidadService,
    AfipModContratacionService,
    AfipSiniestradoService,
    AfipSituacionService,
    FotoService,
    PdfService,
    Personal,
    Foto,
    Pdf
  ],
  entryComponents: [
    
  ]
})
export class PersonalModule { }
