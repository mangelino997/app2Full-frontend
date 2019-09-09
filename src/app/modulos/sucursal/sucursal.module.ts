import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalRoutingModule } from './sucursal-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SucursalComponent } from 'src/app/componentes/sucursal/sucursal.component';
import { SucursalService } from 'src/app/servicios/sucursal.service';

@NgModule({
  declarations: [
    SucursalComponent,
  ],
  imports: [
    CommonModule,
    SucursalRoutingModule,
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
    SucursalService
  ]
})
export class SucursalModule { }
