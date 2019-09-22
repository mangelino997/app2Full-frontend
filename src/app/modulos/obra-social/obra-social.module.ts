import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObraSocialRoutingModule } from './obra-social-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObraSocialComponent } from 'src/app/componentes/obra-social/obra-social.component';
import { ObraSocialService } from 'src/app/servicios/obra-social.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';

@NgModule({
  declarations: [
    ObraSocialComponent,
  ],
  imports: [
    CommonModule,
    ObraSocialRoutingModule,
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
    ObraSocialService,
    SubopcionPestaniaService
  ]
})
export class ObraSocialModule { }
