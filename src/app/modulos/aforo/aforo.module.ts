import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AforoRoutingModule } from './aforo-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatDialogModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AforoComponent } from 'src/app/componentes/aforo/aforo.component';
import { TextMaskModule } from 'angular2-text-mask';
import { Aforo } from 'src/app/modelos/aforo';
import { VentaConfigService } from 'src/app/servicios/venta-config.service';

@NgModule({
  declarations: [
    AforoComponent,
  ],
  imports: [
    CommonModule,
    AforoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    TextMaskModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    Aforo,
    VentaConfigService
  ]
})
export class AforoModule { }
