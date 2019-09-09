import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubroProductoRoutingModule } from './rubro-producto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RubroProductoComponent } from 'src/app/componentes/rubro-producto/rubro-producto.component';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';

@NgModule({
  declarations: [
    RubroProductoComponent,
  ],
  imports: [
    CommonModule,
    RubroProductoRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatProgressBarModule,
    MatIconModule
  ],
  providers: [
    RubroProductoService
  ]
})
export class RubroProductoModule { }
