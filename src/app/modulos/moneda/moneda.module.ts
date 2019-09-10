import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonedaRoutingModule } from './moneda-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatDialogModule, MatDividerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonedaComponent, CambiarMonedaPrincipalDialogo } from 'src/app/componentes/moneda/moneda.component';
import { MonedaService } from 'src/app/servicios/moneda.service';
import { Moneda } from 'src/app/modelos/moneda';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    MonedaComponent,
    CambiarMonedaPrincipalDialogo
  ],
  imports: [
    CommonModule,
    MonedaRoutingModule,
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
    MatDividerModule
  ],
  providers: [
    MonedaService,
    Moneda,
    SubopcionPestaniaService
  ],
  entryComponents: [
    CambiarMonedaPrincipalDialogo
  ]
})
export class MonedaModule { }
