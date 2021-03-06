import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolRoutingModule } from './rol-routing.module';

import {
  MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule,
  MatSelectModule, MatProgressBarModule, MatButtonModule, MatIconModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolComponent } from 'src/app/componentes/rol/rol.component';
import { RolService } from 'src/app/servicios/rol.service';
import { Rol } from 'src/app/modelos/rol';

@NgModule({
  declarations: [
    RolComponent,
  ],
  imports: [
    CommonModule,
    RolRoutingModule,
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
    MatIconModule
  ],
  providers: [
    Rol,
    RolService,
  ]
})
export class RolModule { }
