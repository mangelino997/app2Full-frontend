import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoFamiliarRoutingModule } from './tipo-familiar-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoFamiliarComponent } from 'src/app/componentes/tipo-familiar/tipo-familiar.component';
import { TipoFamiliarService } from 'src/app/servicios/tipo-familiar.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { TipoFamiliar } from 'src/app/modelos/tipo-familiar';

@NgModule({
  declarations: [
    TipoFamiliarComponent,
  ],
  imports: [
    CommonModule,
    TipoFamiliarRoutingModule,
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
    TipoFamiliarService,
    SubopcionPestaniaService,
    TipoFamiliar
  ]
})
export class TipoFamiliarModule { }
