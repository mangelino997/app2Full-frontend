import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonaRoutingModule } from './zona-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZonaComponent } from 'src/app/componentes/zona/zona.component';
import { ZonaService } from 'src/app/servicios/zona.service';

@NgModule({
  declarations: [
    ZonaComponent,
  ],
  imports: [
    CommonModule,
    ZonaRoutingModule,
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
    ZonaService
  ]
})
export class ZonaModule { }
