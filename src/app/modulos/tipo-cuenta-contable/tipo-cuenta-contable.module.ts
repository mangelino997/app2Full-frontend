import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoCuentaContableRoutingModule } from './tipo-cuenta-contable-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoCuentaContableComponent } from 'src/app/componentes/tipo-cuenta-contable/tipo-cuenta-contable.component';
import { TipoCuentaContableService } from 'src/app/servicios/tipo-cuenta-contable.service';
import { TipoCuentaContable } from 'src/app/modelos/tipo-cuenta-contable';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    TipoCuentaContableComponent,
  ],
  imports: [
    CommonModule,
    TipoCuentaContableRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule
  ],
  providers: [
    SubopcionPestaniaService,
    TipoCuentaContableService,
    TipoCuentaContable
  ]
})
export class TipoCuentaContableModule { }
