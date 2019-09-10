import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalBancoRoutingModule } from './sucursal-banco-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SucursalBancoComponent } from 'src/app/componentes/sucursal-banco/sucursal-banco.component';
import { SucursalBancoService } from 'src/app/servicios/sucursal-banco.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { BancoService } from 'src/app/servicios/banco.service';

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
    MatProgressBarModule,
    MatButtonModule
  ],
  providers: [
    SucursalBancoService,
    SubopcionPestaniaService,
    BancoService
  ]
})
export class SucursalBancoModule { }
