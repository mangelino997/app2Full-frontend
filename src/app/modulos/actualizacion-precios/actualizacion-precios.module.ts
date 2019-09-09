import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ActualizacionPreciosRoutingModule } from './actualizacion-precios-routing.module';
import { ActualizacionPreciosComponent } from 'src/app/componentes/actualizacion-precios/actualizacion-precios.component';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatCheckboxModule, MatPaginatorIntl } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { getDutchPaginatorIntl } from 'src/app/dutch-paginator-intl';
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ActualizacionPrecios } from 'src/app/modelos/actualizacionPrecios';

@NgModule({
  declarations: [
    ActualizacionPreciosComponent,
  ],
  imports: [
    CommonModule,
    ActualizacionPreciosRoutingModule,
    CommonModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCheckboxModule,
    TextMaskModule,
    PdfViewerModule,
    HttpModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
  ],
  providers: [
    ActualizacionPrecios,
    DatePipe,
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }
  ]
})
export class ActualizacionPreciosModule { }
