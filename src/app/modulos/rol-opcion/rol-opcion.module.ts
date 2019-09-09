import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolOpcionRoutingModule } from './rol-opcion-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolOpcionComponent } from 'src/app/componentes/rol-opcion/rol-opcion.component';
import { RolOpcionService } from 'src/app/servicios/rol-opcion.service';

@NgModule({
  declarations: [
    RolOpcionComponent,
  ],
  imports: [
    CommonModule,
    RolOpcionRoutingModule,
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
    RolOpcionService
  ]
})
export class RolOpcionModule { }
