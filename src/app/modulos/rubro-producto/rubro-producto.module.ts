import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubroProductoRoutingModule } from './rubro-producto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule, MatButtonModule, MatDialogModule, MatTreeModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RubroProductoComponent } from 'src/app/componentes/rubro-producto/rubro-producto.component';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { PlanCuentaDialogo } from 'src/app/componentes/plan-cuenta-dialogo/plan-cuenta-dialogo.component';

@NgModule({
  declarations: [
    RubroProductoComponent,
    PlanCuentaDialogo
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
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTreeModule
  ],
  providers: [
    RubroProductoService,
    SubopcionPestaniaService,
    UsuarioEmpresaService
  ],
  entryComponents: [
    PlanCuentaDialogo
  ]
})
export class RubroProductoModule { }
