import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiculoRoutingModule } from './vehiculo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehiculoComponent } from 'src/app/componentes/vehiculo/vehiculo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { VehiculoService } from 'src/app/servicios/vehiculo.service';
import { Vehiculo } from 'src/app/modelos/vehiculo';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { TipoVehiculoService } from 'src/app/servicios/tipo-vehiculo.service';
import { MarcaVehiculoService } from 'src/app/servicios/marca-vehiculo.service';
import { LocalidadService } from 'src/app/servicios/localidad.service';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { CompaniaSeguroPolizaService } from 'src/app/servicios/compania-seguro-poliza.service';
import { CompaniaSeguroService } from 'src/app/servicios/compania-seguro.service';
import { ConfiguracionVehiculoService } from 'src/app/servicios/configuracion-vehiculo.service';
import { PdfService } from 'src/app/servicios/pdf.service';
import { PersonalService } from 'src/app/servicios/personal.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Pdf } from 'src/app/modelos/pdf';

@NgModule({
  declarations: [
    VehiculoComponent
  ],
  imports: [
    CommonModule,
    VehiculoRoutingModule,
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
    MatDialogModule,
    MatIconModule,
    TextMaskModule,
    PdfViewerModule
  ],
  providers: [
    VehiculoService,
    Vehiculo,
    SubopcionPestaniaService,
    TipoVehiculoService,
    MarcaVehiculoService,
    LocalidadService,
    EmpresaService,
    CompaniaSeguroPolizaService,
    CompaniaSeguroService,
    ConfiguracionVehiculoService,
    PdfService,
    PersonalService,
    Vehiculo,
    Pdf
  ],
  entryComponents: []
})
export class VehiculoModule { }
