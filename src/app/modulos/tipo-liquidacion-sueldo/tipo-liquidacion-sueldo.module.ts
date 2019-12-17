import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoLiquidacionSueldoComponent } from 'src/app/componentes/tipo-liquidacion-sueldo/tipo-liquidacion-sueldo.component';
import { TipoLiquidacionSueldoRoutingModule } from './tipo-liquidacion-sueldo-routing.module';



@NgModule({
  declarations: [
    TipoLiquidacionSueldoComponent
  ],
  imports: [
    CommonModule,
    TipoLiquidacionSueldoRoutingModule,
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
})
export class TipoLiquidacionSueldoModule { }
