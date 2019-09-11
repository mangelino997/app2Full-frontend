import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoContactoRoutingModule } from './tipo-contacto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoContactoComponent } from 'src/app/componentes/tipo-contacto/tipo-contacto.component';
import { TipoContactoService } from 'src/app/servicios/tipo-contacto.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    TipoContactoComponent,
  ],
  imports: [
    CommonModule,
    TipoContactoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [
    TipoContactoService,
    SubopcionPestaniaService
  ]
})
export class TipoContactoModule { }
