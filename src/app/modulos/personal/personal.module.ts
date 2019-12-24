import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatSidenavModule, MatIconModule, MatDividerModule, MatDialogModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalComponent } from 'src/app/componentes/personal/personal.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PersonalService } from 'src/app/servicios/personal.service';
import { BarrioService } from 'src/app/servicios/barrio.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { FotoService } from 'src/app/servicios/foto.service';
import { PdfService } from 'src/app/servicios/pdf.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Personal } from 'src/app/modelos/personal';
import { Foto } from 'src/app/modelos/foto';
import { Pdf } from 'src/app/modelos/pdf';
import { BancoService } from 'src/app/servicios/banco.service';
import { SucursalBancoService } from 'src/app/servicios/sucursal-banco.service';

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
    SucursalBancoService,
    PersonalService,
    PersonalService,
    BarrioService,
    LocalidadService,
    BancoService,
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
