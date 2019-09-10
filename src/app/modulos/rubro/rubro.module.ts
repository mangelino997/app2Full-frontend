import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubroRoutingModule } from './rubro-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RubroComponent } from 'src/app/componentes/rubro/rubro.component';
import { RubroService } from 'src/app/servicios/rubro.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    RubroComponent,
  ],
  imports: [
    CommonModule,
    RubroRoutingModule,
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
    RubroService,
    SubopcionPestaniaService
  ]
})
export class RubroModule { }
