import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubroProductoRoutingModule } from './rubro-producto-routing.module';

import { MatTabsModule, MatAutocompleteModule, MatTableModule, MatPaginatorModule, MatSortModule, 
  MatSelectModule, MatProgressBarModule, MatIconModule, MatButtonModule, MatDialogModule, MatTreeModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RubroProductoComponent } from 'src/app/componentes/rubro-producto/rubro-producto.component';
import { RubroProductoService } from 'src/app/servicios/rubro-producto.service';
import { SubopcionPestaniaService } from 'src/app/servicios/subopcion-pestania.service';
import { UsuarioEmpresaService } from 'src/app/servicios/usuario-empresa.service';
import { RubroProductoCuentaContableService } from 'src/app/servicios/rubro-producto-cuenta-contable.service';

@NgModule({
  declarations: [
    RubroProductoComponent
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
    MatTreeModule,
    MatTooltipModule
  ],
  providers: [
    RubroProductoService,
    SubopcionPestaniaService,
    UsuarioEmpresaService,
    RubroProductoCuentaContableService
  ],
  entryComponents: []
})
export class RubroProductoModule { }
