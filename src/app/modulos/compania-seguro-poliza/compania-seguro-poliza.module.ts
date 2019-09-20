import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniaSeguroPolizaRoutingModule } from './compania-seguro-poliza-routing.module';
<<<<<<< HEAD

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
=======
import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatIconModule
} from '@angular/material';
>>>>>>> 851771be2b9f424398f1be9704ca69d2fe54b196
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompaniaSeguroPolizaComponent } from 'src/app/componentes/compania-seguro-poliza/compania-seguro-poliza.component';
import { CompaniaSeguroPolizaService } from 'src/app/servicios/compania-seguro-poliza.service';
import { CompaniaSeguroPoliza } from 'src/app/modelos/companiaSeguroPoliza';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { CompaniaSeguroService } from 'src/app/servicios/compania-seguro.service';
import { EmpresaService } from 'src/app/servicios/empresa.service';
import { FechaService } from 'src/app/servicios/fecha.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    CompaniaSeguroPolizaComponent,

  ],
  imports: [
    CommonModule,
    CompaniaSeguroPolizaRoutingModule,
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
<<<<<<< HEAD
    MatIconModule
=======
    MatIconModule,
    
>>>>>>> 851771be2b9f424398f1be9704ca69d2fe54b196
  ],
  providers: [
    CompaniaSeguroPolizaService,
    CompaniaSeguroPoliza,
    SubopcionPestaniaService,
    CompaniaSeguroService,
    EmpresaService,
    FechaService
  ],
  entryComponents: [
  ]
})
export class CompaniaSeguroPolizaModule { }
