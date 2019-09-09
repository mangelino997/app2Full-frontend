import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalBancoRoutingModule } from './sucursal-banco-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SucursalBancoComponent } from 'src/app/componentes/sucursal-banco/sucursal-banco.component';
import { SucursalBancoService } from 'src/app/servicios/sucursal-banco.service';

@NgModule({
  declarations: [
    SucursalBancoComponent,
  ],
  imports: [
    CommonModule,
    SucursalBancoRoutingModule,
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
    SucursalBancoService
  ]
})
export class SucursalBancoModule { }
