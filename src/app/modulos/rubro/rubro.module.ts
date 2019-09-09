import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubroRoutingModule } from './rubro-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RubroComponent } from 'src/app/componentes/rubro/rubro.component';
import { RubroService } from 'src/app/servicios/rubro.service';

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
    MatProgressBarModule
  ],
  providers: [
    RubroService
  ]
})
export class RubroModule { }
