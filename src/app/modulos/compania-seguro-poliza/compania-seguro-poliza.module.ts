import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompaniaSeguroPolizaRoutingModule } from './compania-seguro-poliza-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatIconModule, MatTooltipModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompaniaSeguroPolizaComponent } from 'src/app/componentes/compania-seguro-poliza/compania-seguro-poliza.component';
import { CompaniaSeguroPolizaService } from 'src/app/servicios/compania-seguro-poliza.service';
import { CompaniaSeguroPoliza } from 'src/app/modelos/companiaSeguroPoliza';
import { CompaniaSeguroService } from 'src/app/servicios/compania-seguro.service';
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
    MatIconModule,
    PdfViewerModule,
    MatTooltipModule,
  ],
  providers: [
    CompaniaSeguroPolizaService,
    CompaniaSeguroPoliza,
    CompaniaSeguroService,
  ],
  entryComponents: []
})
export class CompaniaSeguroPolizaModule { }
