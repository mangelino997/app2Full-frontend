import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoCuentaContableRoutingModule } from './grupo-cuenta-contable-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrupoCuentaContableComponent } from 'src/app/componentes/grupo-cuenta-contable/grupo-cuenta-contable.component';
import { GrupoCuentaContableService } from 'src/app/servicios/grupo-cuenta-contable.service';
import { GrupoCuentaContable } from 'src/app/modelos/grupo-cuenta-contable';

@NgModule({
  declarations: [
    GrupoCuentaContableComponent,
  ],
  imports: [
    CommonModule,
    GrupoCuentaContableRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  providers: [
    GrupoCuentaContableService,
    GrupoCuentaContable
  ]
})
export class GrupoCuentaContableModule { }
